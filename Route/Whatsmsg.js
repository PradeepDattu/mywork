


function Whatsmsg(formType,mobile,fname,date,ename){
    // console.log("cheking");
if(mobile.length!=10){return};
// console.log("working");

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("authkey", "414824AYgyh4tgl5ZR65b75ce6P1");
    switch(formType){

         case "appointment_form": var extraString={
                      "type": "body", 
                      "parameters": [
                          {
                              "type": "text",
                              "text": date || "upcoming date"
                          }
                      ]
                  };break;
        case "astro_form":var extraString="";break;
        case "contact_form":var extraString="";break;
        case "event_form":var extraString={
            
                "type": "body",
                "parameters": [
                    {
                        "type": "text",
                        "text": ename
                    },
                    {
                        "type": "text",
                        "text": date || "upcoming date"
                    }
                ]
            

        };break;          
    }
    var raw = JSON.stringify({
      "integrated_number": "918328500265",
      "content_type": "template",
      "payload": {
          "to": "91"+mobile,
          "type": "template",
          "template": {
              "name": formType,
              "language": {
                  "code": "en",
                  "policy": "deterministic"
              },
              "components": [
                  {
                      "type": "header",
                      "parameters": [
                          {
                              "type": "text",
                              "text": fname
                          }
                      ]
                  },
                  extraString
              ]
          },
          "messaging_product": "whatsapp"
      }
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    fetch("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/",requestOptions)
    .then(response => response.text())
    .catch(error => console.log('error', error));
    

    
}

module.exports={Whatsmsg};