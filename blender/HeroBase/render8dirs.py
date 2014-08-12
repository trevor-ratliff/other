##import Blender
##from Blender import *
##from Blender.Scene import Render
##
##pi = 3.14159
##deg45 = 45 * pi / 180
##
##context = Scene.GetCurrent().getRenderingContext()
##basePath = context.renderPath
##
##for i in range(1,9):
##	  # objects without parents should be parented to RenderPlatform
##    platform = Object.Get('RenderPlatform')
##    platform.RotZ = platform.RotZ - deg45
##    platform.setLocation(platform.getLocation()) # refreshes the child locations
##    context.renderPath = basePath + str(i)
##    context.renderAnim()
##    Blender.Redraw()
##context.renderPath = basePath

import bpy
from bpy import *

pi = 3.14159
deg45 = 45 * pi / 180

mycontext = bpy.context.scene.render
basePath = mycontext.filepath

for i in range(1,9):
	# objects without parents should be parented to RenderPlatform
	# rotate RenderPlatform
	platform = bpy.data.objects['RenderPlatform']
	platform.rotation_euler.z = platform.rotation_euler.z - deg45
	
	# refresh object to push rotation to child objects
	platform.update_tag()
	
	# set render file path for this angle
	mycontext.filepath = basePath + str(i) + '\\'
	
	# render scene
	bpy.ops.render.render(animation=True)
	
mycontext.filepath = basePath
bpy.data.objects['RenderPlatform'].rotation_euler.z = 0
