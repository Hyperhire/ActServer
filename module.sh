#! /bin/bash

MODULE_PATH="src/"

controller="import { Request, Router, Response } from 'express'

const router = Router()

router.get(\"/\", (request: Request, response: Response) => {})

export default router"

if [ $1=="module" ] && [ $2=="create" ]; then
    module_name=$3
    module_path="${MODULE_PATH}${module_name}"
    mkdir ${module_path}
    controller_path="${module_path}/${module_name}.controller.ts"
    service_path="${module_path}/${module_name}.service.ts"
    touch "${controller_path}"
    echo $"${controller}" >$controller_path
    touch "${service_path}"

fi
