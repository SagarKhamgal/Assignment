public with sharing class LoadFieldsetObjects {
  //fetch picklist values from custom object in lwc
  @AuraEnabled(cacheable = true)
  public static List < customValueWrapper > pickListValueDynamically() {
    list < customValueWrapper > customObjWrapper = new list < customValueWrapper > ();
    try {
      List < Schema.SObjectType > objList = Schema.getGlobalDescribe().Values();
      for (Schema.SObjectType obj: objList) {
        Schema.DescribeSObjectResult d = obj.getDescribe();
        Map < String, Schema.FieldSet > FsMap = d.fieldSets.getMap();
        if (!FsMap.isEmpty()) {
          Schema.FieldSet fs1 = d.fieldSets.getMap().get('DatatableFields');
          if (fs1 != null) {
            customValueWrapper selectOptionValueWrapper = new customValueWrapper();
            selectOptionValueWrapper.custFldlabel = obj.getDescribe().getLabel();
            selectOptionValueWrapper.custFldvalue = obj.getDescribe().getName();
            customObjWrapper.add(selectOptionValueWrapper);
          }
        }
      }
    } catch (Exception e) {
      System.debug('The following exception has occurred: ' + e.getMessage());
    }
    return customObjWrapper;
  }
  // wrapper class 
  public with sharing class customValueWrapper {
    @auraEnabled public string custFldlabel {
      get;
      set;
    }
    @auraEnabled public string custFldvalue {
      get;
      set;
    }
  }
}