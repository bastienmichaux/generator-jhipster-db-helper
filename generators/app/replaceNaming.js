var replace = require("replace");
var fs = require("fs");


// The following assumes that the pertinent configuration files are there and with these current naming strategy.
// this is true with jhipster v4.1.1
var fileWithNamingStrategyPaths = ["./pom.xml", "./src/main/resources/config/application.yml", "./src/test/resources/config/application.yml"];
fileWithNamingStrategyPaths.forEach( function(path) {
	if (!fs.existsSync(path)) {
		throw new Error(path + " doesn't exist!");
	}
});

var physicalOld = "org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy";
var physicalNew = "org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl";

var implicitOld = "org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy";
var implicitNew = "org.hibernate.boot.model.naming.ImplicitNamingStrategyJpaCompliantImpl";

replace({
	regex: physicalOld,
	replacement: physicalNew,
	paths: fileWithNamingStrategyPaths,
	recursive: false,
	silent: true,
});

replace({
	regex: implicitOld,
	replacement: implicitNew,
	paths: fileWithNamingStrategyPaths,
	recursive: false,
	silent: true,
});

