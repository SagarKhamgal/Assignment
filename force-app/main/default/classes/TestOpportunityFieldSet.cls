@IsTest
public class TestOpportunityFieldSet {
    public TestOpportunityFieldSet() {

    }
    @IsTest
    static void testOppFieldSet() {
        List<String> OrgFieldSet = new List<String>{'OwnerId','Amount','IsPrivate','CloseDate','Name','NextStep','AccountId','StageName','Type','Probability','LeadSource','CampaignId','OrderNumber__c','MainCompetitors__c','CurrentGenerators__c','DeliveryInstallationStatus__c','TrackingNumber__c','Description'};
        Test.startTest();
        List<String> NewFieldSet = OpportunityFieldSet.getFieldsFromFieldSet('OpportunityFieldSet','Opportunity');
        Test.stopTest();
        System.assertEquals(NewFieldSet, OrgFieldSet);
    }
     
}