from odoo import http
from odoo.addons.bus.controllers.main import BusController
from odoo.http import request
from odoo.addons.portal.controllers.mail import PortalChatter, _message_post_helper
from odoo.tools import plaintext2html

class ProjectTaskController(BusController):

    def _poll(self, dbname, channels, last, options):
        """Add the relevant channels to the BusController polling."""
        if options.get('project.task'):
            channels = list(channels)
            lock_channel = (
                request.db,
                'project.task',
                options.get('project.task')
            )
            channels.append(lock_channel)
        return super(ProjectTaskController, self)._poll(dbname, channels, last, options)


class PortalChatterExtends(PortalChatter):
    
    @http.route(['/mail/chatter_post_json'], type='json', methods=['POST'], auth='public', website=True)
    def portal_chatter_post_json(self, res_model, res_id, message, **kw):
        url = request.httprequest.referrer
        notifications = []
        if message:
            # message is received in plaintext and saved in html
            message = plaintext2html(message)
            _message_post_helper(res_model, int(res_id), message, **kw)
            if res_model == 'project.task':
                users_list = []
                for user in request.env['res.users'].search([]):
                    users_list.append(user.id)
                for user_id in users_list:
                    notifications.append(((request._cr.dbname, 'project.task', user_id),
                                          {'chatter_notification': True, 'project_task_id': int(res_id)}))
                if notifications:
                    request.env['bus.bus'].sendmany(notifications)
                    
            url = url + "#discussion"
        return request.redirect(url)
    
    @http.route(['/mail/chatter_post'], type='http', methods=['POST'], auth='public', website=True)
    def portal_chatter_post(self, res_model, res_id, message, **kw):
        url = request.httprequest.referrer
        notifications = []
        if message:
            # message is received in plaintext and saved in html
            message = plaintext2html(message)
            _message_post_helper(res_model, int(res_id), message, **kw)
            if res_model == 'project.task':
                users_list = []
                for user in request.env['res.users'].search([]):
                    users_list.append(user.id)
                for user_id in users_list:
                    notifications.append(((request._cr.dbname, 'project.task', user_id),
                                          {'chatter_notification': True, 'project_task_id': int(res_id)}))
                if notifications:
                    request.env['bus.bus'].sendmany(notifications)
            url = url + "#discussion"
        return request.redirect(url)

    @http.route(['/chatter/pulling/interval'], type='json', auth='none', website=True)
    def chatter_pulling_interval(self, **kw):
        return int(request.env['ir.config_parameter'].sudo().get_param('real_time_task_message.notification_task_fetching_interval', default=5000))
