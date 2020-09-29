# -*- coding: utf-8 -*-
from odoo import fields, models, api

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    notification_task_fetching_interval = fields.Integer(string="Notification Fetching Interval", default=5000)

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        res['notification_task_fetching_interval'] = int(self.env['ir.config_parameter'].sudo().get_param('real_time_task_message.notification_task_fetching_interval', default=5000))
        return res

    @api.model
    def set_values(self):
        self.env['ir.config_parameter'].sudo().set_param('real_time_task_message.notification_task_fetching_interval', self.notification_task_fetching_interval)
        super(ResConfigSettings, self).set_values()
