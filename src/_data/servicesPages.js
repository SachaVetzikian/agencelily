// Services qui utilisent le gabarit générique service.njk (le livre d'or a ses propres pages)
module.exports = require("./services.json").filter((s) => !s.url);
