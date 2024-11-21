public with sharing class multiStepFormWithNavigation {
    public multiStepFormWithNavigation() {

    }
    @AuraEnabled
    public static Id createAccount(string Name,string phone,string Rating , string Type ){
        Account acc = new Account();
        acc.Name = Name;
        acc.Phone = phone;
        acc.Rating = Rating;
        acc.Type = Type;

        insert acc;
        return acc.Id;
    }

    @AuraEnabled
    public static Id createContact(string FirstName, string LastName , string  Phone, string Email,Id createdAccountId){
        Contact con = new Contact();
        con.FirstName = FirstName;
        con.LastName = LastName;
        con.Phone = Phone;
        con.Email = Email;
        con.AccountId = createdAccountId;
        
        insert con;
        return con.Id;
    }
}