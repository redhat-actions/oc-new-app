require('./sourcemap-register.js');module.exports=(()=>{"use strict";var e={351:function(e,t,n){var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const s=i(n(87));const o=n(278);function issueCommand(e,t,n){const i=new Command(e,t,n);process.stdout.write(i.toString()+s.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const r="::";class Command{constructor(e,t,n){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=n}toString(){let e=r+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const n in this.properties){if(this.properties.hasOwnProperty(n)){const i=this.properties[n];if(i){if(t){t=false}else{e+=","}e+=`${n}=${escapeProperty(i)}`}}}}e+=`${r}${escapeData(this.message)}`;return e}}function escapeData(e){return o.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return o.toCommandValue(e).replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},186:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=n(351);const r=n(717);const c=n(278);const u=s(n(87));const a=s(n(622));var f;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(f=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){const n=c.toCommandValue(t);process.env[e]=n;const i=process.env["GITHUB_ENV"]||"";if(i){const t="_GitHubActionsFileCommandDelimeter_";const i=`${e}<<${t}${u.EOL}${n}${u.EOL}${t}`;r.issueCommand("ENV",i)}else{o.issueCommand("set-env",{name:e},n)}}t.exportVariable=exportVariable;function setSecret(e){o.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){const t=process.env["GITHUB_PATH"]||"";if(t){r.issueCommand("PATH",e)}else{o.issueCommand("add-path",{},e)}process.env["PATH"]=`${e}${a.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const n=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!n){throw new Error(`Input required and not supplied: ${e}`)}return n.trim()}t.getInput=getInput;function setOutput(e,t){o.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setCommandEcho(e){o.issue("echo",e?"on":"off")}t.setCommandEcho=setCommandEcho;function setFailed(e){process.exitCode=f.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){o.issueCommand("debug",{},e)}t.debug=debug;function error(e){o.issue("error",e instanceof Error?e.toString():e)}t.error=error;function warning(e){o.issue("warning",e instanceof Error?e.toString():e)}t.warning=warning;function info(e){process.stdout.write(e+u.EOL)}t.info=info;function startGroup(e){o.issue("group",e)}t.startGroup=startGroup;function endGroup(){o.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return i(this,void 0,void 0,function*(){startGroup(e);let n;try{n=yield t()}finally{endGroup()}return n})}t.group=group;function saveState(e,t){o.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},717:function(e,t,n){var i=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const s=i(n(747));const o=i(n(87));const r=n(278);function issueCommand(e,t){const n=process.env[`GITHUB_${e}`];if(!n){throw new Error(`Unable to find environment variable for file command ${e}`)}if(!s.existsSync(n)){throw new Error(`Missing file at path: ${n}`)}s.appendFileSync(n,`${r.toCommandValue(t)}${o.EOL}`,{encoding:"utf8"})}t.issueCommand=issueCommand},278:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});function toCommandValue(e){if(e===null||e===undefined){return""}else if(typeof e==="string"||e instanceof String){return e}return JSON.stringify(e)}t.toCommandValue=toCommandValue},514:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=s(n(159));function exec(e,t,n){return i(this,void 0,void 0,function*(){const i=o.argStringToArray(e);if(i.length===0){throw new Error(`Parameter 'commandLine' cannot be null or empty.`)}const s=i[0];t=i.slice(1).concat(t||[]);const r=new o.ToolRunner(s,t,n);return r.exec()})}t.exec=exec},159:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var n in e)if(Object.hasOwnProperty.call(e,n))t[n]=e[n];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const o=s(n(87));const r=s(n(614));const c=s(n(129));const u=s(n(622));const a=s(n(436));const f=s(n(962));const l=process.platform==="win32";class ToolRunner extends r.EventEmitter{constructor(e,t,n){super();if(!e){throw new Error("Parameter 'toolPath' cannot be null or empty.")}this.toolPath=e;this.args=t||[];this.options=n||{}}_debug(e){if(this.options.listeners&&this.options.listeners.debug){this.options.listeners.debug(e)}}_getCommandString(e,t){const n=this._getSpawnFileName();const i=this._getSpawnArgs(e);let s=t?"":"[command]";if(l){if(this._isCmdFile()){s+=n;for(const e of i){s+=` ${e}`}}else if(e.windowsVerbatimArguments){s+=`"${n}"`;for(const e of i){s+=` ${e}`}}else{s+=this._windowsQuoteCmdArg(n);for(const e of i){s+=` ${this._windowsQuoteCmdArg(e)}`}}}else{s+=n;for(const e of i){s+=` ${e}`}}return s}_processLineBuffer(e,t,n){try{let i=t+e.toString();let s=i.indexOf(o.EOL);while(s>-1){const e=i.substring(0,s);n(e);i=i.substring(s+o.EOL.length);s=i.indexOf(o.EOL)}t=i}catch(e){this._debug(`error processing line. Failed with error ${e}`)}}_getSpawnFileName(){if(l){if(this._isCmdFile()){return process.env["COMSPEC"]||"cmd.exe"}}return this.toolPath}_getSpawnArgs(e){if(l){if(this._isCmdFile()){let t=`/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;for(const n of this.args){t+=" ";t+=e.windowsVerbatimArguments?n:this._windowsQuoteCmdArg(n)}t+='"';return[t]}}return this.args}_endsWith(e,t){return e.endsWith(t)}_isCmdFile(){const e=this.toolPath.toUpperCase();return this._endsWith(e,".CMD")||this._endsWith(e,".BAT")}_windowsQuoteCmdArg(e){if(!this._isCmdFile()){return this._uvQuoteCmdArg(e)}if(!e){return'""'}const t=[" ","\t","&","(",")","[","]","{","}","^","=",";","!","'","+",",","`","~","|","<",">",'"'];let n=false;for(const i of e){if(t.some(e=>e===i)){n=true;break}}if(!n){return e}let i='"';let s=true;for(let t=e.length;t>0;t--){i+=e[t-1];if(s&&e[t-1]==="\\"){i+="\\"}else if(e[t-1]==='"'){s=true;i+='"'}else{s=false}}i+='"';return i.split("").reverse().join("")}_uvQuoteCmdArg(e){if(!e){return'""'}if(!e.includes(" ")&&!e.includes("\t")&&!e.includes('"')){return e}if(!e.includes('"')&&!e.includes("\\")){return`"${e}"`}let t='"';let n=true;for(let i=e.length;i>0;i--){t+=e[i-1];if(n&&e[i-1]==="\\"){t+="\\"}else if(e[i-1]==='"'){n=true;t+="\\"}else{n=false}}t+='"';return t.split("").reverse().join("")}_cloneExecOptions(e){e=e||{};const t={cwd:e.cwd||process.cwd(),env:e.env||process.env,silent:e.silent||false,windowsVerbatimArguments:e.windowsVerbatimArguments||false,failOnStdErr:e.failOnStdErr||false,ignoreReturnCode:e.ignoreReturnCode||false,delay:e.delay||1e4};t.outStream=e.outStream||process.stdout;t.errStream=e.errStream||process.stderr;return t}_getSpawnOptions(e,t){e=e||{};const n={};n.cwd=e.cwd;n.env=e.env;n["windowsVerbatimArguments"]=e.windowsVerbatimArguments||this._isCmdFile();if(e.windowsVerbatimArguments){n.argv0=`"${t}"`}return n}exec(){return i(this,void 0,void 0,function*(){if(!f.isRooted(this.toolPath)&&(this.toolPath.includes("/")||l&&this.toolPath.includes("\\"))){this.toolPath=u.resolve(process.cwd(),this.options.cwd||process.cwd(),this.toolPath)}this.toolPath=yield a.which(this.toolPath,true);return new Promise((e,t)=>{this._debug(`exec tool: ${this.toolPath}`);this._debug("arguments:");for(const e of this.args){this._debug(`   ${e}`)}const n=this._cloneExecOptions(this.options);if(!n.silent&&n.outStream){n.outStream.write(this._getCommandString(n)+o.EOL)}const i=new ExecState(n,this.toolPath);i.on("debug",e=>{this._debug(e)});const s=this._getSpawnFileName();const r=c.spawn(s,this._getSpawnArgs(n),this._getSpawnOptions(this.options,s));const u="";if(r.stdout){r.stdout.on("data",e=>{if(this.options.listeners&&this.options.listeners.stdout){this.options.listeners.stdout(e)}if(!n.silent&&n.outStream){n.outStream.write(e)}this._processLineBuffer(e,u,e=>{if(this.options.listeners&&this.options.listeners.stdline){this.options.listeners.stdline(e)}})})}const a="";if(r.stderr){r.stderr.on("data",e=>{i.processStderr=true;if(this.options.listeners&&this.options.listeners.stderr){this.options.listeners.stderr(e)}if(!n.silent&&n.errStream&&n.outStream){const t=n.failOnStdErr?n.errStream:n.outStream;t.write(e)}this._processLineBuffer(e,a,e=>{if(this.options.listeners&&this.options.listeners.errline){this.options.listeners.errline(e)}})})}r.on("error",e=>{i.processError=e.message;i.processExited=true;i.processClosed=true;i.CheckComplete()});r.on("exit",e=>{i.processExitCode=e;i.processExited=true;this._debug(`Exit code ${e} received from tool '${this.toolPath}'`);i.CheckComplete()});r.on("close",e=>{i.processExitCode=e;i.processExited=true;i.processClosed=true;this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);i.CheckComplete()});i.on("done",(n,i)=>{if(u.length>0){this.emit("stdline",u)}if(a.length>0){this.emit("errline",a)}r.removeAllListeners();if(n){t(n)}else{e(i)}});if(this.options.input){if(!r.stdin){throw new Error("child process missing stdin")}r.stdin.end(this.options.input)}})})}}t.ToolRunner=ToolRunner;function argStringToArray(e){const t=[];let n=false;let i=false;let s="";function append(e){if(i&&e!=='"'){s+="\\"}s+=e;i=false}for(let o=0;o<e.length;o++){const r=e.charAt(o);if(r==='"'){if(!i){n=!n}else{append(r)}continue}if(r==="\\"&&i){append(r);continue}if(r==="\\"&&n){i=true;continue}if(r===" "&&!n){if(s.length>0){t.push(s);s=""}continue}append(r)}if(s.length>0){t.push(s.trim())}return t}t.argStringToArray=argStringToArray;class ExecState extends r.EventEmitter{constructor(e,t){super();this.processClosed=false;this.processError="";this.processExitCode=0;this.processExited=false;this.processStderr=false;this.delay=1e4;this.done=false;this.timeout=null;if(!t){throw new Error("toolPath must not be empty")}this.options=e;this.toolPath=t;if(e.delay){this.delay=e.delay}}CheckComplete(){if(this.done){return}if(this.processClosed){this._setResult()}else if(this.processExited){this.timeout=setTimeout(ExecState.HandleTimeout,this.delay,this)}}_debug(e){this.emit("debug",e)}_setResult(){let e;if(this.processExited){if(this.processError){e=new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`)}else if(this.processExitCode!==0&&!this.options.ignoreReturnCode){e=new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`)}else if(this.processStderr&&this.options.failOnStdErr){e=new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`)}}if(this.timeout){clearTimeout(this.timeout);this.timeout=null}this.done=true;this.emit("done",e,this.processExitCode)}static HandleTimeout(e){if(e.done){return}if(!e.processClosed&&e.processExited){const t=`The STDIO streams did not close within ${e.delay/1e3} seconds of the exit event from process '${e.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;e._debug(t)}e._setResult()}}},962:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};var s;Object.defineProperty(t,"__esModule",{value:true});const o=n(357);const r=n(747);const c=n(622);s=r.promises,t.chmod=s.chmod,t.copyFile=s.copyFile,t.lstat=s.lstat,t.mkdir=s.mkdir,t.readdir=s.readdir,t.readlink=s.readlink,t.rename=s.rename,t.rmdir=s.rmdir,t.stat=s.stat,t.symlink=s.symlink,t.unlink=s.unlink;t.IS_WINDOWS=process.platform==="win32";function exists(e){return i(this,void 0,void 0,function*(){try{yield t.stat(e)}catch(e){if(e.code==="ENOENT"){return false}throw e}return true})}t.exists=exists;function isDirectory(e,n=false){return i(this,void 0,void 0,function*(){const i=n?yield t.stat(e):yield t.lstat(e);return i.isDirectory()})}t.isDirectory=isDirectory;function isRooted(e){e=normalizeSeparators(e);if(!e){throw new Error('isRooted() parameter "p" cannot be empty')}if(t.IS_WINDOWS){return e.startsWith("\\")||/^[A-Z]:/i.test(e)}return e.startsWith("/")}t.isRooted=isRooted;function mkdirP(e,n=1e3,s=1){return i(this,void 0,void 0,function*(){o.ok(e,"a path argument must be provided");e=c.resolve(e);if(s>=n)return t.mkdir(e);try{yield t.mkdir(e);return}catch(i){switch(i.code){case"ENOENT":{yield mkdirP(c.dirname(e),n,s+1);yield t.mkdir(e);return}default:{let n;try{n=yield t.stat(e)}catch(e){throw i}if(!n.isDirectory())throw i}}}})}t.mkdirP=mkdirP;function tryGetExecutablePath(e,n){return i(this,void 0,void 0,function*(){let i=undefined;try{i=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(i&&i.isFile()){if(t.IS_WINDOWS){const t=c.extname(e).toUpperCase();if(n.some(e=>e.toUpperCase()===t)){return e}}else{if(isUnixExecutable(i)){return e}}}const s=e;for(const o of n){e=s+o;i=undefined;try{i=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(i&&i.isFile()){if(t.IS_WINDOWS){try{const n=c.dirname(e);const i=c.basename(e).toUpperCase();for(const s of yield t.readdir(n)){if(i===s.toUpperCase()){e=c.join(n,s);break}}}catch(t){console.log(`Unexpected error attempting to determine the actual case of the file '${e}': ${t}`)}return e}else{if(isUnixExecutable(i)){return e}}}}return""})}t.tryGetExecutablePath=tryGetExecutablePath;function normalizeSeparators(e){e=e||"";if(t.IS_WINDOWS){e=e.replace(/\//g,"\\");return e.replace(/\\\\+/g,"\\")}return e.replace(/\/\/+/g,"/")}function isUnixExecutable(e){return(e.mode&1)>0||(e.mode&8)>0&&e.gid===process.getgid()||(e.mode&64)>0&&e.uid===process.getuid()}},436:function(e,t,n){var i=this&&this.__awaiter||function(e,t,n,i){function adopt(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||(n=Promise))(function(n,s){function fulfilled(e){try{step(i.next(e))}catch(e){s(e)}}function rejected(e){try{step(i["throw"](e))}catch(e){s(e)}}function step(e){e.done?n(e.value):adopt(e.value).then(fulfilled,rejected)}step((i=i.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const s=n(129);const o=n(622);const r=n(669);const c=n(962);const u=r.promisify(s.exec);function cp(e,t,n={}){return i(this,void 0,void 0,function*(){const{force:i,recursive:s}=readCopyOptions(n);const r=(yield c.exists(t))?yield c.stat(t):null;if(r&&r.isFile()&&!i){return}const u=r&&r.isDirectory()?o.join(t,o.basename(e)):t;if(!(yield c.exists(e))){throw new Error(`no such file or directory: ${e}`)}const a=yield c.stat(e);if(a.isDirectory()){if(!s){throw new Error(`Failed to copy. ${e} is a directory, but tried to copy without recursive flag.`)}else{yield cpDirRecursive(e,u,0,i)}}else{if(o.relative(e,u)===""){throw new Error(`'${u}' and '${e}' are the same file`)}yield copyFile(e,u,i)}})}t.cp=cp;function mv(e,t,n={}){return i(this,void 0,void 0,function*(){if(yield c.exists(t)){let i=true;if(yield c.isDirectory(t)){t=o.join(t,o.basename(e));i=yield c.exists(t)}if(i){if(n.force==null||n.force){yield rmRF(t)}else{throw new Error("Destination already exists")}}}yield mkdirP(o.dirname(t));yield c.rename(e,t)})}t.mv=mv;function rmRF(e){return i(this,void 0,void 0,function*(){if(c.IS_WINDOWS){try{if(yield c.isDirectory(e,true)){yield u(`rd /s /q "${e}"`)}else{yield u(`del /f /a "${e}"`)}}catch(e){if(e.code!=="ENOENT")throw e}try{yield c.unlink(e)}catch(e){if(e.code!=="ENOENT")throw e}}else{let t=false;try{t=yield c.isDirectory(e)}catch(e){if(e.code!=="ENOENT")throw e;return}if(t){yield u(`rm -rf "${e}"`)}else{yield c.unlink(e)}}})}t.rmRF=rmRF;function mkdirP(e){return i(this,void 0,void 0,function*(){yield c.mkdirP(e)})}t.mkdirP=mkdirP;function which(e,t){return i(this,void 0,void 0,function*(){if(!e){throw new Error("parameter 'tool' is required")}if(t){const t=yield which(e,false);if(!t){if(c.IS_WINDOWS){throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`)}else{throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`)}}}try{const t=[];if(c.IS_WINDOWS&&process.env.PATHEXT){for(const e of process.env.PATHEXT.split(o.delimiter)){if(e){t.push(e)}}}if(c.isRooted(e)){const n=yield c.tryGetExecutablePath(e,t);if(n){return n}return""}if(e.includes("/")||c.IS_WINDOWS&&e.includes("\\")){return""}const n=[];if(process.env.PATH){for(const e of process.env.PATH.split(o.delimiter)){if(e){n.push(e)}}}for(const i of n){const n=yield c.tryGetExecutablePath(i+o.sep+e,t);if(n){return n}}return""}catch(e){throw new Error(`which failed with message ${e.message}`)}})}t.which=which;function readCopyOptions(e){const t=e.force==null?true:e.force;const n=Boolean(e.recursive);return{force:t,recursive:n}}function cpDirRecursive(e,t,n,s){return i(this,void 0,void 0,function*(){if(n>=255)return;n++;yield mkdirP(t);const i=yield c.readdir(e);for(const o of i){const i=`${e}/${o}`;const r=`${t}/${o}`;const u=yield c.lstat(i);if(u.isDirectory()){yield cpDirRecursive(i,r,n,s)}else{yield copyFile(i,r,s)}}yield c.chmod(t,(yield c.stat(e)).mode)})}function copyFile(e,t,n){return i(this,void 0,void 0,function*(){if((yield c.lstat(e)).isSymbolicLink()){try{yield c.lstat(t);yield c.unlink(t)}catch(e){if(e.code==="EPERM"){yield c.chmod(t,"0666");yield c.unlink(t)}}const n=yield c.readlink(e);yield c.symlink(n,t,c.IS_WINDOWS?"junction":null)}else if(!(yield c.exists(t))||n){yield c.copyFile(e,t)}})}},930:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});const i=n(186);const s=n(263);var o;(function(e){const t="app.kubernetes.io/managed-by=oc-new-app-action";async function newApp(e,t,n,o,r){i.info("⏳ Creating Deployment from image of the application...");const c=s.default.getOptions({name:e,labels:o});n.forEach(e=>{c.push(...s.default.getOptions({"build-env":e}))});const u=[s.default.Commands.NewApp,...c,t];if(r){u.push(r)}await s.default.exec(u)}e.newApp=newApp;async function deleteDeployment(e,t){i.info("🔎 Checking for old deployments and deleting if found...");const n=s.default.getOptions({selector:e});const o=[s.default.Commands.Delete,s.default.SubCommands.All,...n];if(t){o.push(t)}await s.default.exec(o)}e.deleteDeployment=deleteDeployment;async function patchSvc(e,t,n){i.info(`⏳ Patching service with the port "${t}" ...`);const o=Number(t);const r={spec:{ports:[{name:`${o}-tcp`,port:o}]}};const c=JSON.stringify(r);const u=s.default.getOptions({patch:c});const a=[s.default.Commands.Patch,s.default.SubCommands.Service,e,...u];if(n){a.push(n)}await s.default.exec(a)}e.patchSvc=patchSvc;async function exposeSvc(e,t,n){i.info(`Exposing the route for "${e}" service...`);const o=[s.default.Commands.Expose,s.default.SubCommands.Service,e];if(t){const e=s.default.getOptions({port:t});o.push(...e)}if(n){o.push(n)}await s.default.exec(o)}e.exposeSvc=exposeSvc;async function getDeployment(e,t){i.info("⏳ Verifying if deployment is created successfully...");const n=s.default.getOptions({selector:e});const o=[s.default.Commands.Get,s.default.SubCommands.All,...n];if(t){o.push(t)}await s.default.exec(o)}e.getDeployment=getDeployment;async function getRoute(e,t){i.info(`⏳ Fetching route of the "${e}" application...`);const n="{.spec.host}";const o=s.default.getOptions({output:""});const r=[s.default.Commands.Get,s.default.SubCommands.Route,e,...o,`jsonpath=${n}{"\\n"}`];if(t){r.push(t)}const c=await s.default.exec(r);return c.stdout.trim()}e.getRoute=getRoute;async function createPullSecretFromFile(e,t,n,o){if(await isPullSecretExists(e,o)){i.info(`ℹ️ Secret "${e}" already present, using this secret`);return}i.info(`⏳ Secret doesn't exist. Creating pull secret using auth file present at ${t}.`);const r=s.default.getOptions({"from-file":`.dockerconfigjson=${t}`,type:"kubernetes.io/dockerconfigjson"});const c=[s.default.Commands.Create,s.default.SubCommands.Secret,"generic",e,...r];if(o){c.push(o)}await s.default.exec(c);await addLabelToSecret(e,n,o)}e.createPullSecretFromFile=createPullSecretFromFile;async function createPullSecretFromCreds(e,t,n,o,r,c){if(await isPullSecretExists(e,c)){i.info(`ℹ️ Secret "${e}" already present, using this secret`);return}i.info(`⏳ Secret doesn't exist. Creating pull secret using provided image registry credentials...`);const u=s.default.getOptions({"docker-server":t,"docker-username":n,"docker-password":o});const a=[s.default.Commands.Create,s.default.SubCommands.Secret,"docker-registry",e,...u];if(c){a.push(c)}await s.default.exec(a);await addLabelToSecret(e,r,c)}e.createPullSecretFromCreds=createPullSecretFromCreds;async function linkSecretToServiceAccount(e,t){const n="default";i.info(`🔗 Linking secret "${e}" to the service account "${n}"...`);const o=s.default.getOptions({for:"pull"});const r=[s.default.Commands.Secrets,s.default.SubCommands.Link,n,e,...o];if(t){r.push(t)}await s.default.exec(r)}e.linkSecretToServiceAccount=linkSecretToServiceAccount;async function addLabelToSecret(e,n,o){i.info(`Adding label "${t}" to secret "${e}"`);const r=[s.default.Commands.Label,s.default.SubCommands.Secret,e,t,n];if(o){r.push(o)}await s.default.exec(r)}async function isPullSecretExists(e,t){i.info(`🔎 Checking if secret "${e}" exists`);const n=[s.default.Commands.Get,s.default.SubCommands.Secret,e];if(t){n.push(t)}try{const e=await s.default.exec(n,{ignoreReturnCode:true,failOnStdErr:false,group:true});if(e.exitCode===0){return true}}catch(e){i.info(e)}return false}e.isPullSecretExists=isPullSecretExists;async function checkPullSecretWithLabel(e,n){let o=false;i.info(`🔎 Checking if secret "${e}" with label "${t}" exists`);const r="{.items[*].metadata.name}";const c=s.default.getOptions({selector:t,output:""});const u=[s.default.Commands.Get,s.default.SubCommands.Secret,...c,`jsonpath=${r}{"\\n"}`];if(n){u.push(n)}const a=await s.default.exec(u);const f=a.stdout.trim().split(" ");o=f.some(t=>t===e);return o}async function deletePullSecretWithLabel(e,n){if(await checkPullSecretWithLabel(e,n)){i.info(`Secret "${e}" with label "${t}" exists, deleting secret...`);const o=[s.default.Commands.Delete,s.default.SubCommands.Secret,e];if(n){o.push(n)}await s.default.exec(o)}else{i.info(`Secret "${e}" with label "${t}" doesn't exist`)}}e.deletePullSecretWithLabel=deletePullSecretWithLabel})(o||(o={}));t.default=o},69:(e,t)=>{Object.defineProperty(t,"__esModule",{value:true});t.Outputs=t.Inputs=void 0;var n;(function(e){e["APP_NAME"]="app_name";e["BUILD_ENV"]="build_env";e["CREATE_PULL_SECRET_FROM"]="create_pull_secret_from";e["IMAGE"]="image";e["IMAGE_PULL_SECRET_NAME"]="image_pull_secret_name";e["NAMESPACE"]="namespace";e["PORT"]="port";e["REGISTRY_HOSTNAME"]="registry_hostname";e["REGISTRY_PASSWORD"]="registry_password";e["REGISTRY_USERNAME"]="registry_username"})(n=t.Inputs||(t.Inputs={}));var i;(function(e){e["ROUTE"]="route";e["SELECTOR"]="selector"})(i=t.Outputs||(t.Outputs={}))},144:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});const i=n(186);const s=n(622);const o=n(87);const r=n(69);const c=n(930);const u=n(314);async function run(){i.debug(`Runner OS is ${u.getOS()}`);i.debug(`Node version is ${process.version}`);const e=i.getInput(r.Inputs.APP_NAME);const t=i.getInput(r.Inputs.IMAGE);const n=i.getInput(r.Inputs.NAMESPACE);const s=i.getInput(r.Inputs.PORT);let o=i.getInput(r.Inputs.CREATE_PULL_SECRET_FROM);const a=i.getInput(r.Inputs.REGISTRY_HOSTNAME);const f=i.getInput(r.Inputs.REGISTRY_USERNAME);const l=i.getInput(r.Inputs.REGISTRY_PASSWORD);const d=i.getInput(r.Inputs.IMAGE_PULL_SECRET_NAME);const p=u.getInputList(r.Inputs.BUILD_ENV);const h=u.getSelector(e);const m=u.getNamespaceArg(n);let w="auth-file-secret";let y=false;if(d){if(await c.default.isPullSecretExists(d,m)){i.info(`Using the provided secret "${d}"`);await c.default.linkSecretToServiceAccount(d,m)}else{throw new Error(`❌ Secret ${d} not found. Make sure that the provided secret exists`)}}else if(o){o=o.toLowerCase();if(o==="docker"||o==="podman"){y=await createPullSecretFromAuthFile(w,o,h,m)}}else if(a){w="registry-creds-secret";y=await createPullSecretFromRegistryCreds(w,a,f,l,h,m)}await c.default.deleteDeployment(h,m);await c.default.newApp(e,t,p,h,m);if(s){await c.default.patchSvc(e,s,m)}else{i.info("No port is provided in the action inputs")}await c.default.exposeSvc(e,s,m);await c.default.getDeployment(h,m);const v=`http://${await c.default.getRoute(e,m)}`;i.info(`✅ ${e} is exposed at ${v}`);i.setOutput(r.Outputs.ROUTE,v);i.setOutput(r.Outputs.SELECTOR,h);if(y){return{pullSecretName:w,namespace:n}}return undefined}async function createPullSecretFromAuthFile(e,t,n,i){let s;if(t==="docker"){s=await createPullSecretFromDocker(e,n,i)}else{s=await createPullSecretFromPodman(e,n,i)}return s}async function createPullSecretFromDocker(e,t,n){const i=s.join(o.homedir(),".docker/config.json");if(await u.fileExists(i)){await c.default.createPullSecretFromFile(e,i,t,n);await c.default.linkSecretToServiceAccount(e,n)}else{throw new Error(`❌ Docker auth file not found at ${i}. `+`Failed to create the pull secret.`)}return true}async function createPullSecretFromPodman(e,t,n){let i=s.join("/","tmp",`podman-run-${process.getuid()}`);if(process.env.XDG_RUNTIME_DIR){i=process.env.XDG_RUNTIME_DIR}const o=s.join(i,"containers","auth.json");if(await u.fileExists(o)){await c.default.createPullSecretFromFile(e,o,t,n);await c.default.linkSecretToServiceAccount(e,n)}else{throw new Error(`❌ Podman auth file not found at ${o}. `+`Failed to create the pull secret.`)}return true}async function createPullSecretFromRegistryCreds(e,t,n,s,o,u){if(isUsernameAndPasswordProvided(n,s)){await c.default.createPullSecretFromCreds(e,t,n,s,o,u);await c.default.linkSecretToServiceAccount(e,u);return true}i.warning(`Inputs ${r.Inputs.REGISTRY_USERNAME} and ${r.Inputs.REGISTRY_PASSWORD} are missing. `+`Pull secret will not be created.`);return false}function isUsernameAndPasswordProvided(e,t){if(e&&!t){i.warning(`Input ${r.Inputs.REGISTRY_USERNAME} is provided but ${r.Inputs.REGISTRY_PASSWORD} is missing. `+`Pull secret will not be created.`)}else if(!e&&t){i.warning(`Input ${r.Inputs.REGISTRY_PASSWORD} is provided but ${r.Inputs.REGISTRY_USERNAME} is missing. `+`Pull secret will not be created.`)}else if(e&&t){return true}return false}run().then(async e=>{i.info("Success.");if(e){const t=u.getNamespaceArg(e.namespace);await c.default.deletePullSecretWithLabel(e.pullSecretName,t)}}).catch(e=>{i.setFailed(e.message)})},263:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});const i=n(87);const s=n(514);const o=n(186);const r=n(314);const c=r.getOS()==="windows"?"oc.exe":"oc";var u;(function(e){let t;(function(e){e["Delete"]="delete";e["NewApp"]="new-app";e["Patch"]="patch";e["Expose"]="expose";e["Get"]="get";e["Create"]="create";e["Secrets"]="secrets";e["Label"]="label"})(t=e.Commands||(e.Commands={}));let n;(function(e){e["All"]="all";e["Service"]="service";e["Route"]="route";e["Secret"]="secret";e["Link"]="link"})(n=e.SubCommands||(e.SubCommands={}));let r;(function(e){e["Selector"]="selector";e["Name"]="name";e["DockerImage"]="docker-image";e["Port"]="port";e["Patch"]="patch";e["Output"]="output";e["JSONPath"]="jsonpath";e["Namespace"]="namespace";e["FromFile"]="from-file";e["Type"]="type";e["For"]="for";e["DockerServer"]="docker-server";e["DockerUsername"]="docker-username";e["DockerPassword"]="docker-password";e["BuildEnv"]="build-env";e["Label"]="labels"})(r=e.Flags||(e.Flags={}));function getOptions(e){return Object.entries(e).reduce((e,t)=>{const[n,i]=t;if(i==null){return e}let s="--"+n;if(i!==""){s+=`=${i}`}e.push(s);return e},[])}e.getOptions=getOptions;async function exec(e,t={}){let n="";let r="";const u={...t};u.ignoreReturnCode=true;u.listeners={stdline:e=>{n+=e+i.EOL},errline:e=>{r+=e+i.EOL}};if(t.group){const t=[c,...e].join(" ");o.startGroup(t)}try{const i=await s.exec(c,e,u);if(t.ignoreReturnCode!==true&&i!==0){let e=`oc exited with code ${i}`;if(r){e+=`\n${r}`}throw new Error(e)}return{exitCode:i,stdout:n,stderr:r}}finally{if(t.group){o.endGroup()}}}e.exec=exec})(u||(u={}));t.default=u},314:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:true});t.getInputList=t.getNamespaceArg=t.fileExists=t.getSelector=t.getOS=void 0;const i=n(186);const s=n(747);let o;function getOS(){if(o==null){const e=process.platform;if(e==="win32"){o="windows"}else if(e==="darwin"){o="macos"}else if(e!=="linux"){i.warning(`Unrecognized OS "${e}"`);o="linux"}else{o="linux"}}return o}t.getOS=getOS;function getSelector(e){return`app=${e}`}t.getSelector=getSelector;async function fileExists(e){try{await s.promises.access(e);return true}catch(e){return false}}t.fileExists=fileExists;function getNamespaceArg(e){let t="";if(e){t=`--namespace=${e}`}else{i.info(`No namespace provided`)}return t}t.getNamespaceArg=getNamespaceArg;function getInputList(e){const t=i.getInput(e);if(!t){return[]}return t.split(/\r?\n/).filter(e=>e).reduce((e,t)=>e.concat(t).map(e=>e.trim()),[])}t.getInputList=getInputList},357:e=>{e.exports=require("assert")},129:e=>{e.exports=require("child_process")},614:e=>{e.exports=require("events")},747:e=>{e.exports=require("fs")},87:e=>{e.exports=require("os")},622:e=>{e.exports=require("path")},669:e=>{e.exports=require("util")}};var t={};function __webpack_require__(n){if(t[n]){return t[n].exports}var i=t[n]={exports:{}};var s=true;try{e[n].call(i.exports,i,i.exports,__webpack_require__);s=false}finally{if(s)delete t[n]}return i.exports}__webpack_require__.ab=__dirname+"/";return __webpack_require__(144)})();
//# sourceMappingURL=index.js.map