const ScriptsService = {
    getAllScripts(knex){
        return knex
            .select('*')
            .from('scripts');
    },
    insertScripts(knex, newScript){
        return knex
            .insert(newScript)
            .into('scripts')
            .returning('*')
            .then((rows) => {
                return rows[0];
            });
    },
    getById(knex, id){
        return knex
            .from('scripts')
            .select('*')
            .where('id', id)
            .first();
    },
    deleteScript(knex, id){
        return knex('scripts')
            .where({id})
            .delete();
    },
    updateScript(knex ,id,newScriptFields){
        return knex('scripts')
            .where({id})
            .update(newScriptFields);
    },
};

module.exports = ScriptsService;