/**
 * Occupation-based role and scenario suggestions for lesson generation
 */

export interface RoleScenario {
  roles: string[];
  examples: string[];
}

/**
 * Suggest realistic workplace roles and scenario examples based on occupation.
 * Used to steer dialogue/role-play toward actual conversations aligned with student goals.
 */
export function getSuggestedRolesAndScenarios(occupationRaw: string | undefined): RoleScenario {
  const occupation = (occupationRaw || '').toLowerCase();
  
  // Software/Engineering
  if (/(software|developer|engineer|engineering|programmer)/.test(occupation)) {
    return {
      roles: ['Tech Lead', 'Product Manager', 'QA Engineer', 'Colleague'],
      examples: ['Daily standup', 'Code review feedback session', 'Sprint planning', 'Incident postmortem']
    };
  }
  
  // Customer Success / Account Management
  if (/(customer success|cs|account manager|customer support|success manager)/.test(occupation)) {
    return {
      roles: ['Client (Director level)', 'Account Manager', 'Project Manager'],
      examples: ['Client kickoff call', 'QBR alignment', 'Renewal negotiation']
    };
  }
  
  // Sales / Business Development
  if (/(sales|account executive|business development|bd)/.test(occupation)) {
    return {
      roles: ['Prospect', 'Sales Manager', 'Account Executive'],
      examples: ['Discovery call', 'Objection handling', 'Pricing discussion']
    };
  }
  
  // Healthcare
  if (/(doctor|physician|nurse|medical|healthcare)/.test(occupation)) {
    return {
      roles: ['Patient', 'Nurse', 'Consultant Physician'],
      examples: ['Patient intake', 'Follow-up consultation', 'Care plan briefing']
    };
  }
  
  // Legal
  if (/(lawyer|attorney|legal)/.test(occupation)) {
    return {
      roles: ['Client', 'Senior Partner', 'Associate'],
      examples: ['Client consultation', 'Contract review', 'Case strategy meeting']
    };
  }
  
  // Education
  if (/(teacher|professor|education|lecturer)/.test(occupation)) {
    return {
      roles: ['Student', 'Colleague', 'Department Chair'],
      examples: ['Parent-teacher conference', 'Curriculum planning', 'Department meeting']
    };
  }
  
  // Finance / Operations / General Business
  if (/(finance|analyst|operations|manager|executive|business)/.test(occupation)) {
    return {
      roles: ['Manager', 'Director', 'Colleague'],
      examples: ['Quarterly results briefing', 'Project update', 'Stakeholder check-in']
    };
  }
  
  // Default generic
  return {
    roles: ['Manager', 'Colleague', 'Client'],
    examples: ['Team sync', 'Project update', 'Stakeholder check-in']
  };
}

/**
 * Get occupation-specific advanced vocabulary exclusions
 */
export function getOccupationExclusions(occupation: string): string {
  const lowerOccupation = occupation.toLowerCase();
  
  if (lowerOccupation.includes('software') || lowerOccupation.includes('developer') || lowerOccupation.includes('programmer')) {
    return `🚫 STRICTLY FORBIDDEN: Basic professional terms like "LinkedIn", "networking", "programming", "coding", "computer", "software", "team", "project", "meeting", "email", "professional development", "career growth"`;
  }
  
  if (lowerOccupation.includes('doctor') || lowerOccupation.includes('physician') || lowerOccupation.includes('medical')) {
    return `🚫 STRICTLY FORBIDDEN: Basic medical terms like "hospital", "patient", "doctor", "medicine", "health", "treatment", "clinic", "nurse", "appointment", "medical practice"`;
  }
  
  if (lowerOccupation.includes('lawyer') || lowerOccupation.includes('attorney') || lowerOccupation.includes('legal')) {
    return `🚫 STRICTLY FORBIDDEN: Basic legal terms like "law", "court", "lawyer", "client", "case", "legal", "attorney", "office", "contract", "agreement"`;
  }
  
  if (lowerOccupation.includes('business') || lowerOccupation.includes('manager') || lowerOccupation.includes('executive')) {
    return `🚫 STRICTLY FORBIDDEN: Basic business terms like "business", "company", "manager", "meeting", "presentation", "email", "office", "team", "project", "strategy", "marketing"`;
  }
  
  return `🚫 STRICTLY FORBIDDEN: Basic professional terms that any working professional would know in their field`;
}
