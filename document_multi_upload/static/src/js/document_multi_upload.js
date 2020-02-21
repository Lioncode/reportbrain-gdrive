odoo.define('document_multi_upload', function (require) {
"use strict";

var core = require('web.core');
var FormController = require('web.FormController');
var framework = require('web.framework');
var _t = core._t;

FormController.include({
    renderButtons: function() {
        var self = this;
        var add_button = false;
        if(!self.$buttons){
            add_button = true;
        }
        self._super.apply(self, arguments);
        if(add_button && self.$buttons){
            self.$buttons.find('.o_form_file_upload_input').change(function(evt){
                var target = evt.target;
                var $form = $(target.form);
                var $file = $(target);
                var value = $file.val();
                console.log("form file input change value : ", value);
                if($file.val() !== ''){
                    var $badge = $form.find(".badge");
                    var serialize = $form.serializeArray();
                    var files = $file.get(0).files;
                    if(!files){
                        self.do_warn(_t('Uploading Error'), _t("Unsupported browsers and versions!"));
                        return;
                    }
                    var count = files.length;
                    var error = [];
                    console.log("form file input serialize object : ", serialize);
                    console.log("form file input select count : ", count);
                    framework.blockUI();
                    $badge.text(count);
                    _.each(files, function(file, index){
                        var data = new FormData();
                        data.append('id', self.getSelectedIds()[0]);
                        data.append('ufile', file);
                        _.each(serialize, function(param){
                            data.append(param.name, param.value);
                        });
                        $.ajax({
                            url: $form.attr("action"),
                            type: 'POST',
                            data: data,
                            dataType: 'json',
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function(ret){
                                console.log("form file(%s) upload result : ", index, ret);
                                if(ret.error){
                                    error.push([ret.error,ret.message].join(":"));
                                }
                                count--;
                                if(count == 0){
                                    framework.unblockUI();
                                    if(error.length){
                                        self.do_warn(_t('Uploading Error'), error.join("<br/>"));
                                    }
                                    if(self.sidebar){
                                        self.sidebar._updateAttachments().then(self.sidebar._redraw.bind(self.sidebar));
                                    }
                                }
                                $badge.text(count ? count : "");
                            }
                        });
                        console.log("form file(%s) upload object : ", index, file);
                    });
                    $file.val("");
                }
            });
        }
        return self.$buttons;
    }
});

});