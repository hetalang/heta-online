export default `/*
template file for creating platform
*/
// add file with units
//include ./qsp-units.heta;

// add another files
// include module.heta type heta;
// include table.xlsx type table with { sheet: 0, omitRows: 3 };

comp1 @Compartment {units: litre} .= 5.5;

S1 @Species {compartment: comp1, units: (1e-6 mole)/litre} .= 10;
P1 @Species {compartment: comp1, units: (1e-6 mole)/litre} .= 0;

r1 @Reaction {actors: S1=>P1, units: (1e-6 mole)/second} 
  := Vmax * S1 / (S1 + Km) * comp1;

Vmax @Const {units: (1e-6 mole)/litre/second} = 1e-5;
Km @Const {units: (1e-6 mole)/litre} = 3.3;

// exports
#export { format: JSON };
//#export { format: YAML };
#export { format: XLSX, omitRows: 3, splitByClass: true };
#export { format: SBML, version: L2V4 };
//#export { format: SLV, eventsOff: false };
//#export { format: DBSolve };
//#export { format: Simbio };
//#export { format: Mrgsolve };
//#export { format: Matlab };
//#export { format: HetaCode };
//#export { format: Julia };
#export { format: Dot };
`;