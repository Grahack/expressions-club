var help_url_prefix = 'http://expressions.club/#blocs';
var colour = 160;

// Un extrait des messages originaux:
// http://code.google.com/p/blockly/source/browse/trunk/msg/js/fr.js

Blockly.Msg.ADD_COMMENT = "Ajouter un commentaire";
Blockly.Msg.AUTH = "Veuillez autoriser cette application à permettre la sauvegarde de votre travail et à l’autoriser de le partager avec vous.";
Blockly.Msg.CHANGE_VALUE_TITLE = "Modifier la valeur :";
Blockly.Msg.CHAT = "Discuter avec votre collaborateur en tapant dans cette zone !";
Blockly.Msg.COLLAPSE_ALL = "Réduire les blocs";
Blockly.Msg.COLLAPSE_BLOCK = "Réduire le bloc";
Blockly.Msg.DELETE_BLOCK = "Supprimer le bloc";
Blockly.Msg.DELETE_X_BLOCKS = "Supprimer %1 blocs";
Blockly.Msg.DISABLE_BLOCK = "Désactiver le bloc";
Blockly.Msg.DUPLICATE_BLOCK = "Dupliquer";
Blockly.Msg.ENABLE_BLOCK = "Activer le bloc";
Blockly.Msg.EXPAND_ALL = "Développer les blocs";
Blockly.Msg.EXPAND_BLOCK = "Développer le bloc";
Blockly.Msg.EXTERNAL_INPUTS = "Entrées externes";
Blockly.Msg.HELP = "Aide";
Blockly.Msg.INLINE_INPUTS = "Entrées en ligne";
Blockly.Msg.NEW_VARIABLE = "Nouvelle variable…";
Blockly.Msg.NEW_VARIABLE_TITLE = "Nom de la nouvelle variable :";
Blockly.Msg.REMOVE_COMMENT = "Supprimer un commentaire";
Blockly.Msg.RENAME_VARIABLE = "Renommer la variable…";
Blockly.Msg.RENAME_VARIABLE_TITLE = "Renommer toutes les variables '%1' en :";

// Préparation du générateur de code basée sur
// http://code.google.com/p/blockly/source/browse/trunk/generators/python.js

Blockly.Expressions = new Blockly.Generator('Expressions');
Blockly.Expressions.INDENT = '  ';
Blockly.Expressions.addReservedWords('p, somme, diff, oppose, produitx, produit, produit., quotient, inverse, carre, racine2, racine, cube, puissance, indice, imagepar, cos, sin');

// La suite, jusqu’au commentaire de fin, n’a pas été modifiée.
// Sauf la suppression du prologue de définition des variables.

/**
 * Initialise the database of variable names.
 */
Blockly.Expressions.init = function() {
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Expressions.finish = function(code) {
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Expressions.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped Expressions string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Expressions string.
 * @private
 */
Blockly.Expressions.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string
                 // Échapper les guillemets, sauf le premier et le dernier
                 // (il faut qu’il y ait un caractère avant et un après).
                 .replace(/(.)"(.)/g, '$1\\"$2')
          ;
  return '"' + string + '"';
};

/**
 * Common tasks for generating Expressions from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Expressions code created for this block.
 * @return {string} Expressions code with comments and subsequent blocks added.
 * @private
 */
Blockly.Expressions.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

// Commentaire de fin (de section non modifiée).

// https://groups.google.com/forum/#!searchin/blockly/indentation/blockly/siVJ3OQQpQU/lYf6jqdTERMJ
Blockly.Generator.prototype.prefixLines = function(text, prefix) {
    // Original was:
    // return prefix + text.replace(/\n(.)/g, '\n' + prefix + '$1');
    var splitted = text.split('\n');
    if (splitted.length == 1) return prefix + text;
    var indented = splitted.map(function (line) {
        // Désactivation de l’indentation.
        if (line.indexOf(' Alors') == 0) return line;
        if (line.indexOf(' Sinon') == 0) return line;
        if (line.indexOf(')') == 0) return line;
        return prefix + line;
    });
    return indented.join('\n');
};

// Blocs et générateurs (groupés, pas comme dans l’original).
// Basés sur:
// http://code.google.com/p/blockly/source/browse/trunk/blocks
// http://code.google.com/p/blockly/source/browse/trunk/generators/python

// Bloc nombre
Blockly.Blocks['nombre'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '#nombresavecblockly');
    this.setColour(colour);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.numberValidator), 'NUM');
    this.setOutput(true);
    this.setTooltip("Nombre");
  }
};
// Gen nombre
Blockly.Expressions['nombre'] = function(block) {
  return block.getFieldValue('NUM');
};


// Bloc Variable
// https://github.com/google/blockly/blob/master/blocks/variables.js
Blockly.Blocks['variable'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '#variables');
    this.setColour(colour);
    this.appendDummyInput()
    .appendField(new Blockly.FieldVariable('x'), 'VAR');
    this.setOutput(true);
    this.setTooltip("Variable.");
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = name;
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};
// Gen Variable
// https://github.com/google/blockly/blob/master/generators/javascript/variables.js
Blockly.Expressions['variable'] = function(block) {
  return block.getFieldValue('VAR');
};

// Conteneur pour le mutator du nombre de termes
Blockly.Blocks['nb_params_container'] = {
  init: function() {
    this.setColour(colour);
    this.appendDummyInput()
        .appendField('Nbre de termes');
    this.appendStatementInput('STACK');
    this.setTooltip('Mettre ici le bon nombre de termes.');
    this.contextMenu = false;
  }
};

// Élément pour le mutator du nombre de termes
Blockly.Blocks['nb_params_item'] = {
  init: function() {
    this.setColour(colour);
    this.appendDummyInput()
        .appendField('un terme');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('À placer autant de fois que nécessaire.');
    this.contextMenu = false;
  }
};

Blockly.mutationToDom = function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
};
Blockly.domToMutationGen = function(block_type) {
    return function(xmlElement) {
        for (var x = 0; x < this.itemCount_; x++) {
          this.removeInput('ITEM' + x);
        }
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        for (var x = 0; x < this.itemCount_; x++) {
          var input = this.appendValueInput('ITEM' + x);
          if (x == 0) {
            input.appendField(block_type);
          }
        }
        if (this.itemCount_ == 0) {
          this.appendDummyInput('EMPTY')
              .appendField(block_type);
        }
    }
};
Blockly.decompose = function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace,
                                              'nb_params_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.itemCount_; x++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'nb_params_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
};
Blockly.composeGen = function(block_type) {
    return function(containerBlock) {
        // Disconnect all input blocks and remove all inputs.
        if (this.itemCount_ == 0) {
          this.removeInput('EMPTY');
        } else {
          for (var x = this.itemCount_ - 1; x >= 0; x--) {
            this.removeInput('ITEM' + x);
          }
        }
        this.itemCount_ = 0;
        // Rebuild the block's inputs.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        while (itemBlock) {
          var input = this.appendValueInput('ITEM' + this.itemCount_);
          if (this.itemCount_ == 0) {
            input.appendField(block_type);
          }
          // Reconnect any child blocks.
          if (itemBlock.valueConnection_) {
            input.connection.connect(itemBlock.valueConnection_);
          }
          this.itemCount_++;
          itemBlock = itemBlock.nextConnection &&
              itemBlock.nextConnection.targetBlock();
        }
        if (this.itemCount_ == 0) {
          this.appendDummyInput('EMPTY')
              .appendField(block_type);
        }
    }
};
Blockly.saveConnections = function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 0;
    while (itemBlock) {
      var input = this.getInput('ITEM' + x);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      x++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
};
Blockly.twoArgsGenGen = function(block_type) {
  return function(block) {
    var cmd = block_type;
    var a = Blockly.Expressions.statementToCode(block, 'A') || '';
    var b = Blockly.Expressions.statementToCode(block, 'B') || '';
    if (a + b === '') return '(' + cmd + ')';
    var num_lines = (a + b).split('\n').length;
    if (num_lines == 1) {
      // Prevent indentation if we only have one line.
      return '(' + cmd + a.substring(Blockly.Expressions.INDENT.length) +
                   ' ' + b.substring(Blockly.Expressions.INDENT.length) + ')';
    } else {
      return '(' + cmd + '\n' + a + '\n' + b + '\n)';
    }
  }
};
Blockly.multiArgGenGen = function(block_type) {
    return function(block) {
      var cmd = block_type;
      var code;
      if (block.itemCount_ == 0) {
        code ='(' + cmd + ')';
      } else if (block.itemCount_ == 1) {
        var argument0 = Blockly.Expressions.statementToCode(block, 'ITEM0') || '';
        code = '(' + cmd + ' ' + argument0 + ')';
      } else {
        var args = [];
        for (var n = 0; n < block.itemCount_; n++) {
          args[n] = Blockly.Expressions.statementToCode(block, 'ITEM' + n) ||
                 Blockly.Expressions.INDENT + '';
        }
        code = '(' + cmd + '\n' + args.join('\n') + '\n)';
      }
      return code;
    }
};

// Bloc p
Blockly.Blocks['par'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-par');
    this.setColour(colour);
    this.appendValueInput('VALUE')
        .appendField('par');
    this.setOutput(true);
    this.setTooltip('Parentheses');
  }
};
// Gen p
Blockly.Expressions['par'] = function(block) {
  var arg = Blockly.Expressions.statementToCode(block, 'VALUE') || '';
  if (arg === '') return '(par)';
  var num_lines = arg.split('\n').length;
  if (num_lines == 1) {
    // Prevent indentation if we only have one line.
    return '(par ' + arg.substring(Blockly.Expressions.INDENT.length) + ')';
  } else {
    return '(par\n' + arg + '\n)';
  }
};

// Bloc somme
Blockly.Blocks['somme'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-somme');
    this.setColour(colour);
    this.appendValueInput('ITEM0')
        .appendField('somme');
    this.appendValueInput('ITEM1');
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['nb_params_item']));
    this.setTooltip('Résultat de l’addition.');
    this.itemCount_ = 2;
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutationGen('somme'),
  decompose: Blockly.decompose,
  compose: Blockly.composeGen('somme'),
  saveConnections: Blockly.saveConnections
};
// Gen somme
Blockly.Expressions['somme'] = Blockly.multiArgGenGen('somme');

// Bloc diff
Blockly.Blocks['diff'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-diff');
    this.setColour(colour);
    this.appendValueInput('A')
        .appendField('diff');
    this.appendValueInput('B');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Résultat de la soustraction.');
  }
};
// Gen diff
Blockly.Expressions['diff'] = Blockly.twoArgsGenGen('diff');

// Bloc oppose
Blockly.Blocks['oppose'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-oppose');
    this.setColour(colour);
    this.appendValueInput('X')
        .appendField('oppose');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Opposé du nombre.');
  }
};
// Gen oppose
Blockly.Expressions['oppose'] = function(block) {
  var x = Blockly.Expressions.statementToCode(block, 'X') || '';
  return '(oppose ' + x.trim() + ')';
};

// Bloc produitx
Blockly.Blocks['produitx'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-produitx');
    this.setColour(colour);
    this.appendValueInput('ITEM0')
        .appendField('produit×');
    this.appendValueInput('ITEM1');
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['nb_params_item']));
    this.setTooltip('Résultat de la multiplication.');
    this.itemCount_ = 2;
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutationGen('produitx'),
  decompose: Blockly.decompose,
  compose: Blockly.composeGen('produitx'),
  saveConnections: Blockly.saveConnections
};
// Gen produitx
Blockly.Expressions['produitx'] = Blockly.multiArgGenGen('produitx');

// Bloc produit
Blockly.Blocks['produit'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-produit');
    this.setColour(colour);
    this.appendValueInput('ITEM0')
        .appendField('produit');
    this.appendValueInput('ITEM1');
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['nb_params_item']));
    this.setTooltip('Résultat de la multiplication.');
    this.itemCount_ = 2;
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutationGen('produit'),
  decompose: Blockly.decompose,
  compose: Blockly.composeGen('produit'),
  saveConnections: Blockly.saveConnections
};
// Gen produit
Blockly.Expressions['produit'] = Blockly.multiArgGenGen('produit');

// Bloc produit.
Blockly.Blocks['produit.'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-produit.');
    this.setColour(colour);
    this.appendValueInput('ITEM0')
        .appendField('produit.');
    this.appendValueInput('ITEM1');
    this.setOutput(true);
    this.setMutator(new Blockly.Mutator(['nb_params_item']));
    this.setTooltip('Résultat de la multiplication.');
    this.itemCount_ = 2;
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutationGen('produit.'),
  decompose: Blockly.decompose,
  compose: Blockly.composeGen('produit.'),
  saveConnections: Blockly.saveConnections
};
// Gen produit.
Blockly.Expressions['produit.'] = Blockly.multiArgGenGen('produit.');

// Bloc quotient
Blockly.Blocks['quotient'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-quotient');
    this.setColour(colour);
    this.appendValueInput('A')
        .appendField('quotient');
    this.appendValueInput('B');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Résultat de la division.');
  }
};
// Gen quotient
Blockly.Expressions['quotient'] = Blockly.twoArgsGenGen('quotient');

// Bloc inverse
Blockly.Blocks['inverse'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-inverse');
    this.setColour(colour);
    this.appendValueInput('X')
        .appendField('inverse');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Inverse du nombre.');
  }
};
// Gen inverse
Blockly.Expressions['inverse'] = function(block) {
  var x = Blockly.Expressions.statementToCode(block, 'X') || '';
  return '(inverse ' + x.trim() + ')';
};

// Bloc carre
Blockly.Blocks['carre'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-carre');
    this.setColour(colour);
    this.appendValueInput('X')
        .appendField('carre');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Carré du nombre.');
  }
};
// Gen carre
Blockly.Expressions['carre'] = function(block) {
  var x = Blockly.Expressions.statementToCode(block, 'X') || '';
  return '(carre ' + x.trim() + ')';
};

// Bloc racine2
Blockly.Blocks['racine2'] = {
  init: function() {
    this.setHelpUrl(help_url_prefix + '-racine2');
    this.setColour(colour);
    this.appendValueInput('X')
        .appendField('racine2');
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Racine carrée du nombre.');
  }
};
// Gen racine2
Blockly.Expressions['racine2'] = function(block) {
  var x = Blockly.Expressions.statementToCode(block, 'X') || '';
  return '(racine2 ' + x.trim() + ')';
};
