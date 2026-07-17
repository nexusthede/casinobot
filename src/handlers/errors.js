const logger = require("../recovery/logger");

module.exports = function setupErrors() {


    process.on(
        "unhandledRejection",
        error => {

            console.error(
                "[Unhandled Rejection]",
                error
            );


            logger.error(
                `Unhandled Rejection: ${error.stack || error}`
            );

        }
    );



    process.on(
        "uncaughtException",
        error => {

            console.error(
                "[Uncaught Exception]",
                error
            );


            logger.error(
                `Uncaught Exception: ${error.stack || error}`
            );

        }
    );



    process.on(
        "warning",
        warning => {

            console.warn(
                "[Warning]",
                warning
            );


            logger.warn(
                `Warning: ${warning.stack || warning}`
            );

        }
    );


    console.log(
        "[System] Error handlers loaded."
    );

};
