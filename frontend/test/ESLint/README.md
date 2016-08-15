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

To install a plugin:
```bash
npm install eslint-[plugin-name-here]
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
linting rule which flags code where an error is caught, and anything other than a new Error object is thrown.

The main takeaway from this example is that in the create function, you return any number of objects associated with
an [ESTree Node object][12] corresponding to the type of node you want to check. That object contains the function that
you use to check the node for compliance with your linting rule(s). If your function determines that the node is
compliant, you don't have to do anything. If the node is not compliant, calling context.report on the node, with your
custom warning/error message makes the linter output the proper warning/error at runtime.

Because we are not submitting our custom rules for incorporation into ESLint's official rules repo, we will have to run our rules manually from the command-line. I will discuss how to do this when I talk about the command-line interface.


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
