public with sharing class OpportunityFieldSet {
    @AuraEnabled(cacheable = true)
    public static List < String > getFieldsFromFieldSet(String fieldSetName, String ObjectName) {
      try {
        if (!String.isEmpty(fieldSetName) && !String.isEmpty(ObjectName)) {
          Map < String, Schema.SObjectType > GlobalDescribeMap = Schema.getGlobalDescribe();
          Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get(ObjectName);
          Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();
          Schema.FieldSet fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap().get(fieldSetName);
          LIST < String > fieldSet = new List < String > ();
          for (Schema.FieldSetMember fieldSetMemberObj: fieldSetObj.getFields()) {
            fieldSet.add(fieldSetMemberObj.getFieldPath());
          }
          return fieldSet;
        }
        return null;
      } catch (Exception e) {
        System.debug('The following exception has occurred: ' + e.getMessage());
        return null;
      }
    }
  }