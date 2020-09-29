odoo.define('real_time_task_message.FormController', function (require) {
"use strict";

    require('bus.BusService');
    var FormController = require('web.FormController');
    var session = require('web.session');
    var cross_tab = require('bus.CrossTab').prototype;

    FormController.include({
        init: function (parent, model, renderer, params) {
            this._super.apply(this, arguments);
            this.call('bus_service', 'updateOption','project.task',session.uid);
            this.call('bus_service', 'onNotification', this, this._onNotification);
            cross_tab._isRegistered = true;
		    cross_tab._isMasterTab = true;
            this.call('bus_service', 'startPolling');
        },
        _onNotification: function(notifications){
            var self = this;
            var record = this.model.get(this.handle, {env: true});
            for (var notif of notifications) {
                if(notif[1].chatter_notification){
                    var project_task_id = notif[1].project_task_id;
                    if(project_task_id == record.currentId){
                        self.reload();
                    }
                }
            }
        },
    });
});
