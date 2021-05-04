'use strict';



var server = require('server');


server.get('Landing', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var contactForm = server.forms.getForm('contactBr');

    res.render('/contactBr/contactBr', {
        actionUrl: URLUtils.url('Contact-Subscribe').toString(), 
        contactForm: contactForm
    });


    next();
});


server.post('Subscribe', server.middleware.https, function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var contactForm = server.forms.getForm('contactBr');
    
    var myForm = req.form;
    var customObjMgr = require('dw/object/CustomObjectMgr');
    var txn = require('dw/system/Transaction');
    txn.begin();

    try{
        var newSubscribe = customObjMgr.createCustomObject('Distribuidor', contactForm.cpf.value);
        
        newSubscribe.custom.cpf = contactForm.cpf.value;
        newSubscribe.custom.email = contactForm.email.value;
        newSubscribe.custom.name = contactForm.name.value;
        newSubscribe.custom.phone = contactForm.phone.value;

        var contactDetails = [ myForm.name, myForm.email, myForm.phone];
        res.json({
            success: true,
            msg: Resource.msg('subscribe.to.contact.us.success', 'contact', null)
        });

    }catch(e) {
        //Oops!
        txn.rollback();
       }
       
    
    


  /*  var isValidEmailid = emailHelper.validateEmail(myForm.email);
    if (isValidEmailid) {
       
        var contactDetails = [ myForm.name, myForm.email, myForm.phone];
        res.json({
            success: true,
            msg: Resource.msg('subscribe.to.contact.us.success', 'contact', null)
        });
    } else {
        res.json({
            error: true,
            msg: Resource.msg('subscribe.to.contact.us.email.invalid', 'contact', null)
        });
    }*/

    next();
});

module.exports = server.exports();
