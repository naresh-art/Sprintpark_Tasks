public with sharing class AccountClass {
    @AuraEnabled
    public static Id createAccount(
        String Name,
        String Phone,
        String Type,
        String Rating,
        Date DOB,
        String Email,
        String CustomerPriority,
        String SLA,
        Date SLAExpirationDate,
        String TypeDescription
    ) {
        // Create the Account instance
        Account acc = new Account();
        acc.Name = Name;
        acc.Phone = Phone;
        acc.Type = Type;
        acc.Rating = Rating;
        
        // Set additional fields
        acc.DOB__c = DOB;
        acc.Email__c = Email;
        
        acc.CustomerPriority__c = CustomerPriority;
        acc.SLA__c = SLA;
        acc.SLAExpirationDate__c = SLAExpirationDate;

        if (Type == 'Other' && TypeDescription != null) {
            acc.Type_Description__c = TypeDescription;
        }

        try {
            insert acc;  // Insert the Account record
            return acc.Id;  // Return the ID of the new Account
        } catch (Exception ex) {
            System.debug('Error: ' + ex.getMessage());
            throw new AuraHandledException('Account creation failed: ' + ex.getMessage());
        }
    }
}