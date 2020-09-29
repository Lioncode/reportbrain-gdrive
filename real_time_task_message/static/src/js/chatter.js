odoo.define('real_time_task_message.Chatter', function (require) {
"use strict";

    var core = require('web.core');
    var session = require('web.session');
    var ajax = require('web.ajax');
    var PortalChatter = require('portal.chatter');
    var time = require('web.time');

    var QWeb = core.qweb;
    var _t = core._t;
    
    
    PortalChatter.PortalChatter.include({
    	start: function () {
            var res = this._super.apply(this, arguments);
            var self = this;
            ajax.jsonRpc("/chatter/pulling/interval", 'call').then(function (interval){
                if (self.options.res_model && self.options.res_model == 'project.task' && self.options.res_id){
                    setInterval(function(){
                        self.messageFetch([]);
                    }, interval);
                }
            });
            return res;
        },
        _onSubmitButtonClick: function (ev) {
        	ev.preventDefault();
        	debugger;
        	var res_model = $('input[name="res_model"]').val();
        	var message = $('textarea[name="message"]').val();
        	var res_id = $('input[name="res_id"]').val();
        	var token = $('input[name="token"]').val();
        	var pid = $('input[name="pid"]').val();
        	var hash = $('input[name="hash"]').val();
        	var sha_in = $('input[name="sha_in"]').val();
        	var sha_time = $('input[name="sha_time"]').val();
        	
        	var params = {'res_model': res_model, 'message':message, 'res_id':res_id, 'token':token, 'pid': pid, 'hash': hash, 'sha_in':sha_in, 'sha_time':sha_time}
        	var self= this;
        	ajax.jsonRpc("/mail/chatter_post_json", 'call',params).then(function (){
        		$('textarea[name="message"]').val('');
        		self.messageFetch([]);
            });
        	//return $.Deferred();
        },
    });
});
