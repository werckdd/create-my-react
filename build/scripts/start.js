const logger = require('../lib/logger')
const project = require('../../project.config' ) 
const server = require('../../server/server_Express') 

logger.info('Starting server...')
server.listen(project.port, () => {
    logger.success(`==> 🌎  Server is running at http://localhost:${project.port}`)
})

