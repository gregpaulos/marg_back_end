const database = require(`./database-connection`);

let numberOfEstablishments = null;

module.exports = {
    numberOfEstablishments,

    getNumberOfEstablishments() {
        return database(`establishments`).max(`id`).first()
            .then(id => { numberOfEstablishments = id.max; console.log(numberOfEstablishments) })
    },

    async getEstablishments() {
        await this.getNumberOfEstablishments();
        let ids = [0, 0, 0, 0, 0];
        let match = false;
        ids = ids.map((id, index) => {
            while(id === 0 || match === true) {
                id = Math.ceil(Math.random() * numberOfEstablishments);
                match = false;
                for(let i = 0; i < index; i++) {
                    if(id === ids[i]) { match = true }
                }
            }
            return id
        })
        console.log(ids)
        return database(`establishments`)
          .where(`id`, ids[0])
          .orWhere(`id`, ids[1])
          .orWhere(`id`, ids[2])
          .orWhere(`id`, ids[3])
          .orWhere(`id`, ids[4])
    },

    getEstablishmentsQuickly() {
        return database(`establishments`).where(`id`, `<`, 6)
    }
};