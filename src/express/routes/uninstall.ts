import { ExpressReqRes } from '../'
import { AppControllers } from '../../controllers'

export function uninstall(appControllers: AppControllers) {
    return async function handleUninstallRequest({req, res} : ExpressReqRes) {
        const id = _extractIdFromRequest(req)

        if(!id) {
            res.json({success: false, message: 'Id is not provided'})
        }

        const uninstallTime = Date.now()

        const event = {
            id: id,
            data: [{
                type: 'uninstall',
                details: {},
                time: uninstallTime
            }]
        }

        let result
        try {
            result = await appControllers.eventLog({event})
        } catch(err) {
            res.json({success: false, message: err})
        }
        
        res.redirect('http://worldbrain.io/uninstall')
      }
}

function _extractIdFromRequest(req) : string {
    return req.query['user']
}