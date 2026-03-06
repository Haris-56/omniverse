
export function replaceVariables(text, contact) {
  if (!text) return "";
  
  // Create a normalized map of contact keys for easy lookup
  const contactMap = {};
  Object.keys(contact).forEach(k => {
      contactMap[k.toLowerCase().trim()] = contact[k];
  });

  // Match {{var}} case-insensitive
  const regex = /\{\{([^}]+)\}\}/gi;
  return text.replace(regex, (match, key) => {
      const cleanKey = key.trim().toLowerCase();
      // Look up in normalized map
      const val = contactMap[cleanKey];
      return val !== undefined ? val : match; 
  });
}

export function processEmailContent(content, contact, campaignSettings) {
    let body = replaceVariables(content, contact);
    
    // Add Unsubscribe Link if enabled
    if (campaignSettings?.addUnsubscribe) {
        // In a real app, this would be a trackable link. For now, a formatted text link.
        const unsubscribeHtml = `
            <br><br>
            <div style="color: #999; font-size: 11px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
                Changed your mind? <a href="#" style="color: #666;">Unsubscribe</a> or manage your preferences.
            </div>
        `;
        body += unsubscribeHtml;
    }
    
    return body;
}
