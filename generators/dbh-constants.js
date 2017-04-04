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
    filesWithNamingStrategy: [
        './pom.xml',
        './src/main/resources/config/application.yml',
        './src/test/resources/config/application.yml',
        './node_modules/generator-jhipster/generators/server/templates/gradle/_liquibase.gradle',
        './node_modules/generator-jhipster/generators/server/templates/src/main/resources/config/_application.yml',
        './node_modules/generator-jhipster/generators/server/templates/src/test/resources/config/_application.yml'
    ],


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
    implicitNamingStrategyOld : 'org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy',


    /**
     * A more neutral implicit naming strategy used by jhipster-db-helper
     * @const
     * @type {string}
     */
    implicitNamingStrategyNew : 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl',


    /**
     * A more neutral physical naming strategy used by jhipster-db-helper
     * @const
     * @type {string}
     */
    physicalNamingStrategyNew : 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl'
};

module.exports = constants;
