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
        './gradle/liquibase.gradle',
    ],

    /**
     * The application file for the current JHipster app.
     * @constant
     * @todo Delete this constant and replace its references once we know how to grab it from the calling application.
     * @type {string}
     */
    applicationConfigFile: './.yo-rc.json',


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
     * A more neutral implicit naming strategy used by jhipster-db-helper. [Doc]{https://github.com/hibernate/hibernate-orm/blob/master/hibernate-core/src/main/java/org/hibernate/boot/model/naming/ImplicitNamingStrategyJpaCompliantImpl.java}
     * @const
     * @type {string}
     */
    implicitNamingStrategyNew: 'org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl',


    /**
     * A more neutral physical naming strategy used by jhipster-db-helper. [Doc]{https://github.com/hibernate/hibernate-orm/blob/master/hibernate-core/src/main/java/org/hibernate/boot/model/naming/PhysicalNamingStrategyStandardImpl.java}
     * @const
     * @type {string}
     */
    physicalNamingStrategyNew: 'org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl'
};

module.exports = constants;
