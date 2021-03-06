import { ExpressReqRes } from '../'
import { AppControllers } from '../../controllers'

export function generateToken(appControllers: AppControllers) {
    return async function handleGeneateTokenRequest({req, res} : ExpressReqRes) {
        let installTime = _extractInstallTimeFromRequest(req)

        if(!installTime) {
            installTime = Date.now()
        }

        let result

        try {
            result = await appControllers.generateToken({installTime})

            // Add install event when we generate the user id
            const installEvent = {
                id: result.id,
                data: [{
                    type: 'install',
                    details: {},
                    time: installTime
                }]
            }

            await appControllers.eventLog({event: installEvent})
        } catch(err) {
            res.json({message: err, success: false})
        }

        res.json({id: result.id, success: result.success})
      }
}

function _extractInstallTimeFromRequest(req) : number {
    return req.body.installTime
}