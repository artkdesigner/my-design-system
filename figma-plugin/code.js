figma.showUI(__html__, { width: 320, height: 200 });

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

async function collectVariables() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const result = {
    exportedAt: new Date().toISOString(),
    fileName: figma.root.name,
    collections: []
  };

  for (const collection of collections) {
    const variables = [];

    for (const id of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (!variable) continue;

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

  return result;
}

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'export') return;
  try {
    const data = await collectVariables();
    figma.ui.postMessage({ type: 'result', json: JSON.stringify(data, null, 2) });
  } catch (error) {
    figma.ui.postMessage({ type: 'error', message: String(error) });
  }
};
