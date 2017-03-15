# vCDAT

## Developer Clean Setup

1. Fork the repo
2. Clone your fork (`git clone git@github.com:$USERNAME/vcdat`)
3. Install homebrew
4. Run `scripts/setup_mac.sh` (May require sudo, if virtualenv is not installed)
5. Run `scripts/autorun.sh`
6. Go to [http://localhost:5000/](#)
7. Run the [linter](https://github.com/UV-CDAT/vcdat/test/ESLint/README.md) to test code quality

## Developer Update
1. Run `scripts/setup_mac.sh` (May require sudo, if virtualenv is not installed)

### Naming Convention
* newfolder
* NewFile
* NewClass
* newFunction
* new_variable  

Filenames should correspond to the class exported by default.  
Example: `import CoolClass from './cool/CoolClass.js'`

# Built With

<img src=http://js.devexpress.com/Content/Images/features/html5-css-javascript-logos.png height="120px">
<img src=https://cdn.worldvectorlogo.com/logos/react.svg height="150px">
<img src=https://raw.githubusercontent.com/reactjs/redux/master/logo/logo.png height="130px">
<img src="http://flask.pocoo.org/static/badges/flask-powered.png" border="0" alt="Flask powered" title="Flask powered">

