# Blender → GLB checklist (what is still missing)

The 3D scene currently uses **stand-in procedural models** (`frontend/src/components/scene/models.ts`): cylinders, lathes,
instanced bristles and tori. They are NOT production product models and do not match the reference exactly.

## Objects to model (names must match `ATTACHMENTS[].name` in `src/lib/choreo.ts`)
MainDevice, Brush_Round_Large, Brush_Round_Medium, Brush_Round_Small, Barrel_Left, Barrel_Right, Smoothing_Brush,
Diffuser_Ring, Concentrator, Display_Pedestal. Add or remove objects only to match the real product set.

## Per object
1. Real-world scale, origin at the object's centre, long axis = +Y, Apply All Transforms (Ctrl+A).
2. Bevels on every hard edge; bristles as a separate low-poly mesh or alpha-card strip (instance them in Blender).
3. Materials: cream matte (roughness ~0.55), champagne / rose-gold metal (metalness 1, roughness 0.25–0.35). Bake normal + ORM maps, 1024–2048 px, sRGB for colour only.
4. Keep each attachment a separate named object in one collection; cable as its own object on MainDevice.
5. Budget: < 60k triangles total, < 8 MB GLB.

## Export
File → Export → glTF 2.0 (.glb): +Y up, Apply Modifiers, Compression (Draco) ON, no cameras/lights.
Optimise with `npx gltf-transform optimize in.glb out.glb --texture-compress webp`.
Place the file at `frontend/public/models/luxora-hero.glb`.

## Integration
In `models.ts` replace each `build*` with a lookup by name from `GLTFLoader` (+ `DRACOLoader`), keep the same pivots.
`choreo.ts` (orbits, descent, pedestal slots) does not change. Re-run `npx tsx scripts/check-choreo.ts` afterwards,
because real bounding sizes change the clearance numbers.
