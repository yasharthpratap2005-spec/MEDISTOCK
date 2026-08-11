@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM
@REM Required ENV vars:
@REM JAVA_HOME - location of a JDK home dir
@REM
@REM Optional ENV vars
@REM MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
@REM MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
@REM MAVEN_OPTS - parameters passed to the Java VM when running Maven
@REM     e.g. to debug Maven itself, use
@REM set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
@REM MAVEN_SKIP_RC - flag to disable loading of mavenrc files
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%" == "on"  echo %MAVEN_BATCH_ECHO%

@REM set %HOME% to equivalent of $HOME
@IF "%HOME%" == "" (SET "HOME=%HOMEDRIVE%%HOMEPATH%")

@REM Execute a user defined script before this one
@IF NOT "%MAVEN_SKIP_RC%" == "" GOTO skipRc
@SET "rcfile=%USERPROFILE%\mavenrc_pre.bat"
@IF EXIST "%rcfile%" CALL "%rcfile%"
:skipRc

@setlocal

@SET MAVEN_CMD_LINE_ARGS=%*

@SET WRAPPER_JAR="%~dp0.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%~dp0.mvn\wrapper\maven-wrapper.properties") DO (
    @IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)

@REM Extension to allow automatically downloading the maven-wrapper.jar from Maven-central
@REM This allows using the maven wrapper in projects that prohibit checking in binary data.
@IF EXIST %WRAPPER_JAR% (
    @IF "%MVNW_VERBOSE%" == "true" @echo Found %WRAPPER_JAR%
) ELSE (
    @IF NOT "%MVNW_REPOURL%" == "" SET DOWNLOAD_URL="%MVNW_REPOURL%/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

    @IF "%MVNW_VERBOSE%" == "true" (
        @ECHO Couldn't find %WRAPPER_JAR%, downloading it ...
        @ECHO Downloading from: %DOWNLOAD_URL%
    )

    @powershell -Command "&{"^
        "$webclient = new-object System.Net.WebClient;"^
        "if (-not ([string]::IsNullOrEmpty('%MVNW_USERNAME%') -and [string]::IsNullOrEmpty('%MVNW_PASSWORD%'))) {"^
        "$webclient.Credentials = new-object System.Net.NetworkCredential('%MVNW_USERNAME%', '%MVNW_PASSWORD%');"^
        "}"^
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $webclient.DownloadFile('%DOWNLOAD_URL%', '%WRAPPER_JAR%')"^
        "}"
    if "%ERRORLEVEL%" NEQ "0" goto error
)

@REM If specified, validate the SHA-256 sum of the Maven wrapper jar file
@SET WRAPPER_SHA_256_SUM=""
@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%~dp0.mvn\wrapper\maven-wrapper.properties") DO (
    @IF "%%A"=="wrapperSha256Sum" SET WRAPPER_SHA_256_SUM=%%B
)
@IF NOT %WRAPPER_SHA_256_SUM%=="" (
    @powershell -Command "&{"^
        "$hash = (Get-FileHash \"%WRAPPER_JAR%\" -Algorithm SHA256).Hash.ToLower();"^
        "If('%WRAPPER_SHA_256_SUM%' -ne $hash) {"^
        "  Write-Output 'Error: Failed to validate Maven wrapper SHA-256, your Maven wrapper might be compromised.';"^
        "  Write-Output 'Investigate or delete %WRAPPER_JAR% to attempt a clean download.';"^
        "  Write-Output 'If you updated your Maven version, you need to update the specified wrapperSha256Sum property.';"^
        "  exit 1;"^
        "}"^
        "}"
    if "%ERRORLEVEL%" NEQ "0" goto error
)

@SET MAVEN_JAVA_EXE="%JAVA_HOME%\bin\java.exe"
@set WRAPPER_LAUNCHER_CLASSPATH=%WRAPPER_JAR%
@set MAVEN_OPTS=

@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%~dp0.mvn\wrapper\maven-wrapper.properties") DO (
    @IF "%%A"=="distributionUrl" SET MAVEN_JAR_URL=%%B
)

"%MAVEN_JAVA_EXE%" %JVM_CONFIG_MAVEN_PROPS% %MAVEN_OPTS% %MAVEN_DEBUG_OPTS% -classpath "%WRAPPER_LAUNCHER_CLASSPATH%" "-Dmaven.multiModuleProjectDirectory=%~dp0" %WRAPPER_LAUNCHER% %MAVEN_CMD_LINE_ARGS%
if ERRORLEVEL 1 goto error
goto end

:error
SET ERROR_CODE=1

:end
@endlocal & SET ERROR_CODE=%ERROR_CODE%

@IF "%MAVEN_BATCH_PAUSE%" == "on" pause
@IF "%MAVEN_TERMINATE_CMD%" == "on" exit %ERROR_CODE%

@cmd /C exit /B %ERROR_CODE%
