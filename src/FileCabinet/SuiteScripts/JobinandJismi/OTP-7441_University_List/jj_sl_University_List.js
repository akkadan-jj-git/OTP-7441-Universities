/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/http'],
    /**
 * @param{serverWidget} serverWidget
 */
    (serverWidget, http) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === 'GET'){
                    let form = serverWidget.createForm({
                        title: 'University List'
                    });
                    let filter = form.addFieldGroup({
                        id: 'custpage_filtergroup',
                        label: 'Select Country'
                    });
                    let country = form.addField({
                        id: 'custpage_country',
                        label: 'Select Country',
                        type: serverWidget.FieldType.SELECT,
                        container: 'custpage_filtergroup'
                    });
                    country.isMandatory = true;
                    country.addSelectOption({ 
                        value: '', 
                        text: 'Select Country' 
                    });
                    country.addSelectOption({ 
                        value: 'India', 
                        text: 'India' 
                    });
                    country.addSelectOption({ 
                        value: 'China', 
                        text: 'China' 
                    });
                    country.addSelectOption({ 
                        value: 'Japan', 
                        text: 'Japan' 
                    });
                    form.addSubmitButton({
                        label: 'Fetch'
                    });

                    let list = form.addSublist({
                        id: 'custpage_sublist1',
                        label: 'University List',
                        type: serverWidget.SublistType.LIST
                    });

                    list.addField({
                        id: 'custpage_countryname',
                        label: 'Country',
                        type: serverWidget.FieldType.TEXT
                    });
                    list.addField({
                        id: 'custpage_state',
                        label: 'State/Province',
                        type: serverWidget.FieldType.TEXT
                    });
                    list.addField({
                        id: 'custpage_web',
                        label: 'Web Page Link',
                        type: serverWidget.FieldType.TEXT
                    });
                    scriptContext.response.writePage(form);
                }
                else if(scriptContext.request.method === 'POST'){
                    let countryValue = scriptContext.request.parameters.custpage_country;
                    let fn = setSublist(countryValue);
                    scriptContext.response.writePage(fn);
                }
            }
            catch(e){
                log.debug("Error", e.stack + e.message);
            }
        }
        function setSublist(countryValue){
            try{
                let apiResponse = http.get({
                    url: 'http://universities.hipolabs.com/search?country=' + countryValue
                });
                var universities = JSON.parse(apiResponse.body);
                let form = serverWidget.createForm({
                    title: 'University List'
                });
                let filter = form.addFieldGroup({
                    id: 'custpage_filtergroup',
                    label: 'Select Country'
                });
                let country = form.addField({
                    id: 'custpage_country',
                    label: 'Select Country',
                    type: serverWidget.FieldType.SELECT,
                    container: 'custpage_filtergroup'
                });
                country.isMandatory = true;
                country.addSelectOption({ 
                    value: '', 
                    text: 'Select Country' 
                });
                country.addSelectOption({ 
                    value: 'India', 
                    text: 'India' 
                });
                country.addSelectOption({ 
                    value: 'China', 
                    text: 'China' 
                });
                country.addSelectOption({ 
                    value: 'Japan', 
                    text: 'Japan' 
                });
                form.addSubmitButton({
                    label: 'Fetch'
                });

                let list = form.addSublist({
                    id: 'custpage_sublist1',
                    label: 'University List',
                    type: serverWidget.SublistType.LIST
                });

                list.addField({
                    id: 'custpage_countryname',
                    label: 'Country',
                    type: serverWidget.FieldType.TEXT
                });
                list.addField({
                    id: 'custpage_state',
                    label: 'State/Province',
                    type: serverWidget.FieldType.TEXT
                });
                list.addField({
                    id: 'custpage_web',
                    label: 'Web Page Link',
                    type: serverWidget.FieldType.TEXT
                });
                for(let i = 0; i < universities.length; i++){
                    list.setSublistValue({
                        sublistId: 'custpage_sublist1',
                        id: 'custpage_countryname',
                        line: i,
                        value: countryValue || null
                    });
                    list.setSublistValue({
                        sublistId: 'custpage_sublist1',
                        id: 'custpage_state',
                        line: i,
                        value: universities[i]['state-province'] || null
                    });
                    list.setSublistValue({
                        sublistId: 'custpage_sublist1',
                        id: 'custpage_web',
                        line: i,
                        value: universities[i].web_pages[0] || null
                    });
                }
                return(form);
            }
            catch(e){
                log.debug('Error@setSublist()', e.stack + '\n' + e.message)
            }
        }

        return {onRequest, setSublist}

    });
