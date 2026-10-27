import { describe, it, expect } from 'vitest';
import { ALLOWED_TRANSITIONS } from '../../server/src/services/listing.service.js';

describe('Listing State Machine Transitions', () => {
  it('should allow DRAFT to transition to SUBMITTED or ARCHIVED', () => {
    expect(ALLOWED_TRANSITIONS.DRAFT).toEqual(['SUBMITTED', 'ARCHIVED']);
  });

  it('should allow PENDING_REVIEW to transition to APPROVED, PUBLISHED, REJECTED, SUSPENDED', () => {
    expect(ALLOWED_TRANSITIONS.PENDING_REVIEW).toContain('APPROVED');
    expect(ALLOWED_TRANSITIONS.PENDING_REVIEW).toContain('PUBLISHED');
    expect(ALLOWED_TRANSITIONS.PENDING_REVIEW).toContain('REJECTED');
  });

  it('should strictly prohibit SOLD listings from returning to PUBLISHED directly', () => {
    expect(ALLOWED_TRANSITIONS.SOLD).not.toContain('PUBLISHED');
    expect(ALLOWED_TRANSITIONS.SOLD).toEqual(['ARCHIVED']);
  });

  it('should prohibit terminal ARCHIVED state from any transitions', () => {
    expect(ALLOWED_TRANSITIONS.ARCHIVED).toEqual([]);
  });
});
