import Koa from 'koa'
import project from '../project.config'

const server = new Koa()


server.listen(project.port)