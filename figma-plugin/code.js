figma.showUI(__html__, { width: 320, height: 200, themeColors: true });

function rgbaToHex({ r, g, b, a }) {
  const to = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  const hex = `#${to(r)}${to(g)}${to(b)}`;
  return a === undefined || a === 1 ? hex : hex + to(a);
}

function normalizeValue(raw) {
  if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
    return { type: 'ALIAS', id: raw.id };
  }
  if (raw && typeof raw === 'object' && 'r' in raw) {
    return { type: 'COLOR', value: rgbaToHex(raw) };
  }
  return { type: 'VALUE', value: raw };
}

async function collectTextStyles() {
  const textStyles = await figma.getLocalTextStylesAsync();
  return textStyles.map((style) => ({
    id: style.id,
    name: style.name,
    fontName: style.fontName,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    boundVariables: style.boundVariables ?? {}
  }));
}

function computeStats(result, allVariables) {
  const knownIds = new Set(
    result.collections.flatMap((c) => c.variables.map((v) => v.id))
  );
  const aliasEntries = result.collections
    .flatMap((c) => c.variables)
    .flatMap((v) => Object.values(v.valuesByMode))
    .filter((entry) => entry.type === 'ALIAS');

  const textStyleAliasIds = result.textStyles
    .flatMap((style) => Object.values(style.boundVariables))
    .map((alias) => alias.id);

  return {
    variables: knownIds.size,
    aliases: aliasEntries.length,
    danglingAliasIds: [
      ...new Set(aliasEntries.filter((e) => !knownIds.has(e.id)).map((e) => e.id))
    ],
    textStyles: result.textStyles.length,
    danglingTextStyleAliasIds: [
      ...new Set(textStyleAliasIds.filter((id) => !knownIds.has(id)))
    ],
    orphanVariables: allVariables.length - knownIds.size
  };
}

async function buildExport() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const allVariables = await figma.variables.getLocalVariablesAsync();

  const variablesByCollection = new Map();
  for (const variable of allVariables) {
    const list = variablesByCollection.get(variable.variableCollectionId) || [];
    list.push(variable);
    variablesByCollection.set(variable.variableCollectionId, list);
  }

  const result = {
    exportedAt: new Date().toISOString(),
    fileName: figma.root.name,
    collections: []
  };

  for (const collection of collections) {
    const variables = [];
    const collectionVariables = variablesByCollection.get(collection.id) || [];

    for (const variable of collectionVariables) {
      const valuesByMode = {};
      for (const modeId of Object.keys(variable.valuesByMode)) {
        valuesByMode[modeId] = normalizeValue(variable.valuesByMode[modeId]);
      }

      variables.push({
        id: variable.id,
        name: variable.name,
        resolvedType: variable.resolvedType,
        valuesByMode
      });
    }

    result.collections.push({
      id: collection.id,
      name: collection.name,
      defaultModeId: collection.defaultModeId,
      modes: collection.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
      variables
    });
  }

  result.textStyles = await collectTextStyles();
  result.stats = computeStats(result, allVariables);

  return result;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'export') return;
  try {
    const data = await buildExport();
    // stats дублируются: один раз внутри json (для parse-export.mjs), второй раз
    // отдельным полем — иначе UI пришлось бы разбирать всю многомегабайтную
    // выгрузку только ради статуса. Это осознанный размен, не недосмотр.
    figma.ui.postMessage({ type: 'result', json: JSON.stringify(data, null, 2), stats: data.stats });
  } catch (error) {
    console.error(error);
    figma.ui.postMessage({ type: 'error', message: String(error) });
  }
};
