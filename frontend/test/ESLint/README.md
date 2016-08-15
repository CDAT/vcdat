### Table of Contents:
    * [What is ESLint?](#eslint)
    * [Configuration](#configuration)
        * [Adding rules](#adding-rules)
        * [Using predefined rules](#using-predefined-rules)
        * [Adding plugins](#adding-plugins)
    * [Creating custom rules](#creating-custom-rules)
    * [The Command Line Interface](#the-eslint-cli)
        * [Automatic config setup](#automatic-config-setup)
        * [Running the linter](#running-the-linter)
        * [Running custom rules](#running-custom-rules)


# ESLint

[ESLint][1] is a [Javascript linting tool][2] . It assesses our code to ensure that it both conforms to
our code style, and is free of typical Javascript developer faux pas.

This helps us to maintain code quality by preventing certain types of bugs before they happen, and by keeping the code
clean and easy on the eyes of our dev team.

## Configuration

We configure our linter with .eslintrc.json files. The frontend/ directory contains the 'root' configuration file.
Each sub-directory can contain its own .eslintrc.json file, if we want to leverage the [configuration cascading][3]
feature of ESLint. This lets us universally apply the 'root' configuration, while allowing for directory-specific
configurations that can override 'root', when necessary.

I will touch briefly on basic configuration options below. If you want to learn more, you can check out
[ESLint's configuration guide][4].

### Adding rules

To add individual rules to .eslintrc.json, we merely have to add a "rules" object. This object contains the rule we want
to activate, and any options that may go with that rule.
```javascript
{
    "rules": {
        "max-len": ["error", 120, 4], // If a line is >120 characters long, error. Count \t characters as 4 spaces.
        "spaced-comment": ["error", "always"] // Error if a comment does not have a space before its text.
    }
}
```
There is a huge set of [rules included in ESLint][5], and there are [many npm packages][6] that expand the rule set.

### Using predefined rules sets

If you don't want to go through the pain of searching for and applying individual rules, you can make your configuration
[extend][7] a pre-defined rule set.

Here is an example of our 'root' .eslintrc.json, which uses the [ESLint][5] and [React][8] recommended rules sets
(ESLint's recommended rules are denoted with a :heavy_check_mark:).
```javascript
{
    "extends": ["eslint:recommended", "plugin:react/recommended"], // We use the React plugin for vCDAT
    "rules":{
        // Your rules here
    }
}
```
__Note:__ If your rules extend a [plugin][9], you have to [specify the plugin along with the name of the rule set][10].

### Adding plugins

ESLint can account for lots of variations on vanilla Javascript, including the use of ES6, ES7, jsx, etc.
But if you're using some other Javascript framework, you will likely need to include a plugin so that the linter can
correctly interpret your project, and so you have rules presets for developing in that framework's paradigm.

To install a plugin via the commandline:
```bash
$npm install eslint-[plugin-name-here]
```

There are tons of [plugins][9] available through npm.
vCDAT is a React application, and we use the recommended React linting rules, so our project includes this plugin as a
devDependency.

## Creating rules

One of our primary reasons for selecting ESLint as opposed to some other linting utility is that it is the only linter
that allows us to create custom rules. For instance, we want out variable names to all be snake_case; since there is no
builtin rule for that, we plan to write a custom rule to check our variable names to ensure this convention is followed.

To build a new rule, create a Javascript file with the following format:
```javascript

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: { // doc is optional
            description: "disallow unnecessary semicolons",
            category: "Possible Errors",
            recommended: true
        },
        fixable: "code", // if it's fixable, you have to write the js that fixes it
        schema: [] // for specifying options
    },
    create: function(context) {
        return {
            // Following example from https://vimeo.com/119903352
            // Specify which node types to check, and what function to run
            "ThrowStatement": function(node) {
                if(node.argument.type === "New Expression" &&
                   node.argument.callee.name === "Error") {
                    // Threw an error object. Good job!
                    return;
                }

                // This line produces the warning/error output for the linter
                context.report(node, "Please only throw new Error() objects");
            }
        };
    }
};
```

Above is an example taken from [Jamund Ferguson's][11] presentation on creating rules with ESLint. It's a simple
linting rule which flags code where an error is caught and anything other than a new Error object is thrown.

The main takeaway is that in the create function you return any number of objects, each associated with
an [ESTree Node object][12] corresponding to the type of node you want to check. That object contains the function that
you use to check instances of that node type for compliance with your linting rule(s).
If your function determines that the node is compliant, you don't have to do anything.
If the node is not compliant, calling context.report on the node, with your custom warning/error message makes
the linter output the proper warning/error at runtime.


Because we are not submitting our custom rules for incorporation into ESLint's official rules repo, we will have to
[run custom rules manually](#running-custom-rules) from the command-line.
I will show how to do this when I discuss the command-line interface.

For more on building custom ESLint rules, check out [ESLint's guide][13].

## The ESLint CLI

ESLint's CLI supports many options such as specifyin the environment to run int, which parser should be used, specific
files to ignore, etc. I will briefly touch on one or two parts of the CLI that we will use heavily, and let the
[ESLint CLI documentation][14] speak for the rest.

In our repository, the linter can be accessed through ```frontend/node_modules/.bin/eslint``` .

### Automatic config setup

If you're setting up a new directory and want to use ESLint to generate your .eslintrc.json file, you can run:
```$ frontend/node_modules/.bin/eslint --init .eslintrc.json```
on an empty file called ```.eslintrc.json```. This will allow you to choose options such as whether you want to use ES6
syntax, if you are using jsx, etc.

### Running the linter

To run the linter on all files in frontent/src/ according to the 'root' configuration:
```bash
$ frontend/node_modules/.bin/eslint -f table frontend/src
```

This outputs the linter warnings and errors in table format. There are [many other formatting options][15].

### Running custom rules

To use custom rules that haven't been incorporated into the official ESLint rules repository, you will need to provide
a commandline option specifying which custom rules you want to use, and where to load them from.
All the custom rules for our project will be located in frontend/test/ESLint/custom.

To load a rule called 'snake-case' from our custom rules directory:
```bash
$ frontend/node_modules/.bin/eslint -f table --rule 'snake-case: 1' --rulesdir frontend/test/ESLint/custom frontend/src
```

You can also enable your custom rules in the ```.eslintrc.json``` file,
provided its name doesn't clash with another rule.


[1]: http://eslint.org/
[2]: http://mikecavaliere.com/javascript-linting-what-developers-need-to-know/
[3]: http://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
[4]: http://eslint.org/docs/user-guide/configuring
[5]: http://eslint.org/docs/rules/
[6]: https://www.npmjs.com/search?q=eslint-config-*
[7]: http://eslint.org/docs/user-guide/configuring#extending-configuration-files
[8]: https://github.com/yannickcr/eslint-plugin-react#user-content-recommended
[9]: https://www.npmjs.com/search?q=eslint-plugin-*
[10]: http://eslint.org/docs/user-guide/configuring#using-the-configuration-from-a-plugin
[11]: https://www.pubnub.com/blog/2015-03-13-linting-ensure-javascript-code-quality-eslint/
[12]: https://github.com/estree/estree/blob/master/spec.md#node-objects
[13]: http://eslint.org/docs/developer-guide/working-with-rules
[14]: http://eslint.org/docs/user-guide/command-line-interface
[15]: http://eslint.org/docs/user-guide/command-line-interface#f---format
