import swaggerUi from "swagger-ui-express";
import swaggereJsdoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        info: {
            title: "zAPI",
            version: "0.0.0",
            description: "Test API with express by Hyperhire",
        },
        host: "3.36.119.86:4001",
        basePath: "/",
    },
    apis: [
        "./src/api/v1/auth/auth.controller.ts",
        "./src/banner/banner.controller.ts",
        "./src/campaigns/campaigns.controller.ts",
        "./src/faq/faq.controller.ts",
        "./src/news/news.controller.ts",
        "./src/notices/notice.controller.ts",
        "./src/orgs/org.controller.ts",
        "./src/router.ts",
    ],
};

const specs = swaggereJsdoc(options);

export default { swaggerUi, specs };