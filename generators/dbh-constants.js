const jhicore = require('jhipster-core');

/** jhipster-db-helper constants */
const constants = {
    /**
     * Configuration files in generator-jhipster that include the Spring naming strategies (as of JHipster 4.1.1).
     * These files are replaced by our module to avoid inconsistencies when mapping over an existing DB.
     * This constant could be dynamically initialized instead of being static. It isn't future-proof.
     * @constant
     * @todo Add relevant links (StackOverflow) to this doc
     * @type {string[]}
     */
    filesWithNamingStrategy: {
        base: ['./src/main/resources/config/application.yml', './src/test/resources/config/application.yml'],
        gradle: ['./gradle/liquibase.gradle'],
        maven: ['./pom.xml'],
    },

    /**
     * The application file for the current JHipster app.
     * @constant
     * @warn Currently unused
     * @type {string}
     */
    appConfigFile: '.yo-rc.json',

    /** supported build tools */
    buildTools: ['maven', 'gradle'],

    oracleLimitations: {
        tableNameHardMaxLength: 26,
        tableNameSoftMaxLength: 14
    },

    /** database types supported by JHipster */
    dbTypes: jhicore.JHipsterDatabaseTypes.Types,

    /** relationship types */
    relationshipTypes: jhicore.JHipsterRelationshipTypes.RELATIONSHIP_TYPES,

    /** supported types for sql databases */
    sqlTypes: jhicore.JHipsterFieldTypes.SQL_TYPES,

    /**
     * Original physical naming strategy used by JHipster. Used for search and replace.
     * @const
     * @type {string}
     */
    physicalNamingStrategyOld: 'org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy',

    /**
     * Original implicit naming strategy used by JHipster. Used for search and replace.
     * @const
     * @type {string}
     */
    implicitNamingStrategyOld: 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy',

    /**
     * A more neutral implicit naming strategy used by jhipster-db-helper.
     * [Doc]{https://github.com/hibernate/hibernate-orm/blob/master/hibernate-core/src/main/java/org/hibernate/boot/model/naming/ImplicitNamingStrategyJpaCompliantImpl.java}
     * @const
     * @type {string}
     */
    implicitNamingStrategyNew: 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl',

    /**
     * A more neutral physical naming strategy used by jhipster-db-helper.
     * [Doc]{https://github.com/hibernate/hibernate-orm/blob/master/hibernate-core/src/main/java/org/hibernate/boot/model/naming/PhysicalNamingStrategyStandardImpl.java}
     * @const
     * @type {string}
     */
    physicalNamingStrategyNew: 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl'
};

module.exports = constants;
