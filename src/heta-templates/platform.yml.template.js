export default `{
  $schema: https://hetalang.github.io/heta-compiler/declaration-schema.json,
  id: template,
  notes: platform notes,
  version: v0.1.0,
  keywords: [],
  license: UNLICENSED,
  contributors: [],
  builderVersion: ^0.9.0,
  options: {
    debug: false,
    logPath: output.log,
    unitsCheck: false
  },
  importModule: {
    type: heta,
    source: index.heta
  },
  export: [
    { format: JSON, omit: [], noUnitsExpr: false },
    #{ format: YAML, omit: [], noUnitsExpr: false },
    #{ format: DBSolve, powTransform: keep, version: 26, groupConstBy: 'tags[0]' },
    #{ format: SLV, eventsOff: false, powTransform: keep, version: 26, groupConstBy: 'tags[0]' },
    { format: SBML, version: L2V4 },
    #{ format: Simbio },
    #{ format: Mrgsolve },
    #{ format: Table, omitRows: 0, omit: [], bookType: csv, splitByClass: false },
    #{ format: XLSX, omitRows: 0, omit: [], splitByClass: true },
    #{ format: Julia },
    #{ format: Matlab },
    { format: Dot },
    #{ format: Summary }
  ]
}
`;