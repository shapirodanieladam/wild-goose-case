plugins {
    alias(libs.plugins.kotlin.jvm)
    `java-library`
    `maven-publish`
    application
}

application {
    mainClass.set("com.wildgoose.cli.DemoKt")
}

group = "com.wildgoose"
version = "0.1.0-SNAPSHOT"

tasks.jar {
    manifest {
        attributes["Main-Class"] = "com.wildgoose.cli.DemoKt"
    }
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    from(configurations.runtimeClasspath.get().map { if (it.isDirectory) it else zipTree(it) })
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.kotlin.stdlib)

    implementation(libs.clikt)
    implementation(libs.kotter)
    implementation(libs.kotterxTestSupport)
    implementation(libs.mordant)

    testImplementation(libs.junit.jupiter.api)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testImplementation(libs.kotest.runner.junit5)
    testImplementation(libs.kotest.assertions.core)
    testImplementation(libs.mockk)
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(17)
}

java {
    withSourcesJar()
    withJavadocJar()
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
        }
    }
}