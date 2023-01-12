public with sharing class LoadFieldRecordsFromFieldset {
    @AuraEnabled()
    public static String getFieldsAndRecords(String strObjectApiName, String strfieldSetName) {
      try {
        Map<String, String> returnMap = new Map<String,String>();
        if (!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName)) {
          //get fields from FieldSet
          SObject sObj = (SObject)(Type.forName('Schema.' + strObjectApiName).newInstance());
          List < Schema.FieldSetMember > lstFSMember =
            sObj.getSObjectType().getDescribe().fieldSets.getMap().get(strfieldSetName).getFields();
          //prepare SOQL query based on fieldAPIs	
          String query = 'SELECT Id ';
          for (Schema.FieldSetMember f: lstFSMember) {
            if (f.getFieldPath() != 'Id')
              query += ', ' + f.getFieldPath();
          }
          query += ' FROM ' + strObjectApiName;
          List < SObject > lstRecords = Database.query(query);
          //prepare a map which will hold fieldList and recordList and return it
          returnMap.put('FIELD_LIST', JSON.serialize(lstFSMember));
          returnMap.put('RECORD_LIST', JSON.serialize(lstRecords));
          return JSON.serialize(returnMap);
        }
        
        else
            return null;
    }
    catch (Exception e) {
        System.debug('Exception' + e.getMessage());
        return null;
      }
    }
  }