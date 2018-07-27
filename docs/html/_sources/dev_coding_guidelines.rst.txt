.. _dev-coding-guidelines:

=================================
Coding Guidelines
=================================

The following is a set of coding guidelines that all code submitted to this project must follow. The overall goal of these guidelines is to increase code readability, maintainability, and consistency, as well as ensure that the code written is testable without excessive workarounds. 

- Naming conventions:

  + newfolder
  + NewFile
  + NewClass
  + newFunction
  + new_variable

- Filenames should correspond to the class exported by default.

  + Example: `import CoolClass from './cool/CoolClass.js'`

- Components that need css should create a folder of the same name

  + Example: `src/js/components/CoolClass/Coolclass.js` and `src/js/components/CoolClass/Coolclass.scss`

- No console.log()

  + Generally console.log should be for debugging only. Use console.warn or console.error when errors or unexpected states are encountered.

- Component testing suggestions:

  + New components: >80%
  + Legacy components 50%
