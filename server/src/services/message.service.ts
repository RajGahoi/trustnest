import { getDatabase } from '../db/connection.js';
import { AppError } from '../middlewares/error.js';

export class MessageService {
  public static getConversations(userId: string) {
    const db = getDatabase();
    // Retrieve conversations where user is either buyer or seller
    const convRows = db.prepare(`
      SELECT 
        c.*,
        CASE 
          WHEN c.buyer_id = ? THEN u_seller.name 
          ELSE u_buyer.name 
        END as other_participant_name,
        CASE 
          WHEN c.buyer_id = ? THEN u_seller.avatar_url 
          ELSE u_buyer.avatar_url 
        END as other_participant_avatar,
        CASE 
          WHEN c.buyer_id = ? THEN c.seller_id 
          ELSE c.buyer_id 
        END as other_participant_id,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != ? AND m.is_read = 0) as unread_count
      FROM conversations c
      LEFT JOIN users u_buyer ON c.buyer_id = u_buyer.id
      LEFT JOIN users u_seller ON c.seller_id = u_seller.id
      WHERE c.buyer_id = ? OR c.seller_id = ?
      ORDER BY c.created_at DESC
    `).all(userId, userId, userId, userId, userId, userId) as any[];

    return convRows.map(c => ({
      id: c.id,
      listingId: c.listing_id,
      listingTitle: c.listing_title,
      listingImage: c.listing_image,
      listingPrice: c.listing_price,
      otherParticipantId: c.other_participant_id,
      otherParticipantName: c.other_participant_name || 'Verified User',
      otherParticipantAvatar: c.other_participant_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      lastMessage: c.last_message,
      lastMessageAt: c.last_message_at,
      unreadCount: c.unread_count || 0
    }));
  }

  public static getMessages(conversationId: string, userId: string) {
    const db = getDatabase();

    // Verify participant
    const conv = db.prepare('SELECT buyer_id, seller_id FROM conversations WHERE id = ?').get(conversationId) as any;
    if (!conv) {
      throw new AppError('Conversation not found.', 404, 'CONVERSATION_NOT_FOUND');
    }

    if (conv.buyer_id !== userId && conv.seller_id !== userId) {
      throw new AppError('Unauthorized access to this conversation.', 403, 'FORBIDDEN');
    }

    // Mark messages as read
    db.prepare('UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ?').run(conversationId, userId);

    const rows = db.prepare(`
      SELECT id, conversation_id, sender_id, sender_name, sender_avatar, text, is_read, created_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `).all(conversationId) as any[];

    return rows.map(r => ({
      id: r.id,
      conversationId: r.conversation_id,
      senderId: r.sender_id,
      senderName: r.sender_name,
      senderAvatar: r.sender_avatar,
      text: r.text,
      isRead: Boolean(r.is_read),
      createdAt: r.created_at
    }));
  }

  public static sendMessage(conversationId: string, sender: { id: string; name: string; avatar?: string }, text: string) {
    const db = getDatabase();
    const cleanText = text.trim().slice(0, 2000);
    if (!cleanText) {
      throw new AppError('Message text cannot be empty.', 400, 'EMPTY_MESSAGE');
    }

    const conv = db.prepare('SELECT id, buyer_id, seller_id FROM conversations WHERE id = ?').get(conversationId) as any;
    if (!conv) {
      throw new AppError('Conversation not found.', 404, 'CONVERSATION_NOT_FOUND');
    }

    const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_id, sender_name, sender_avatar, text, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    `).run(
      id,
      conversationId,
      sender.id,
      sender.name,
      sender.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      cleanText,
      now
    );

    db.prepare(`
      UPDATE conversations
      SET last_message = ?, last_message_at = ?
      WHERE id = ?
    `).run(cleanText, now, conversationId);

    return {
      id,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      text: cleanText,
      isRead: true,
      createdAt: now
    };
  }

  public static startConversation(listingId: string, buyer: { id: string; name: string; avatar?: string }, initialText: string) {
    const db = getDatabase();
    const listing = db.prepare('SELECT id, title, formatted_price, seller_id FROM listings WHERE id = ?').get(listingId) as any;
    if (!listing) {
      throw new AppError('Listing not found.', 404, 'LISTING_NOT_FOUND');
    }

    // Check if conversation already exists between buyer and seller for this listing
    let conv = db.prepare('SELECT id FROM conversations WHERE listing_id = ? AND buyer_id = ?').get(listingId, buyer.id) as any;

    if (!conv) {
      const convId = `conv-${Date.now()}`;
      const firstImage = (db.prepare('SELECT url FROM listing_images WHERE listing_id = ? LIMIT 1').get(listingId) as any)?.url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      db.prepare(`
        INSERT INTO conversations (id, listing_id, listing_title, listing_image, listing_price, buyer_id, seller_id, last_message, last_message_at, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        convId,
        listing.id,
        listing.title,
        firstImage,
        listing.formatted_price,
        buyer.id,
        listing.seller_id,
        initialText,
        time,
        new Date().toISOString()
      );
      conv = { id: convId };
    }

    const message = this.sendMessage(conv.id, buyer, initialText);
    return { conversationId: conv.id, message };
  }
}
