public with sharing class AccountInsertClass {
    public AccountInsertClass() {
 
    }
    public static void insertAccount(List<Account> accList){
        System.debug('Account::');
        for(Account acc:accList){
            acc.Description='Happy Welcome';
        }
        System.debug('Account List::'+accList);
    }
    public static void insertAccountOpp(List<Account> accList){
        System.debug('Opportunity::');
        List<Opportunity> oppList = new List<Opportunity>();
        for(Account acc:accList){
            Opportunity opp = new Opportunity();
            opp.Name = acc.name;
            opp.CloseDate = System.Today();
            opp.StageName = 'Prospecting';
            opp.AccountId = acc.id;
            oppList.add(opp);
            System.debug('Opportunity List after add::'+oppList);
        }
        if(oppList.size()>0){
            insert oppList;
            System.debug('List');
            System.debug('List');
            System.debug('Opportunity List::'+oppList);
        }
    }
}