# SLIDER ONLY!

## Related work

[addyosmani](https://github.com/addyosmani/jquery-ui-bootstrap) has done a lot of pioneer works in combining bootstrap style with jQuery UI. [Xlab](https://github.com/Xlab/jquery-bootstrap-slider) has extracted addyosmani's work in building a slider and make all style file(jQuery, jQuery UI, custom tweaks) in one file.

However, Bootstrap has upgraded into 2.0+. It now depends on jQuery 1.8.2. And addyosmani and Xlab's work depends on jQuery 1.6.2, which is incompatible with v1.8.2.
It has been described in [this issue](https://github.com/Xlab/jquery-bootstrap-slider/issues/1).

## What I'vde done

I grabbed the latest code jQuery UI 1.9.1 and jQuery 1.8.2. I followed the examples in [jQuery UI slider](http://jqueryui.com/slider/). It seemed easily to be figured out. Now everything works fine.

Demo is available in [http://storage.logicmd.net/slider/index.html](http://storage.logicmd.net/slider/index.html).

Enjoy~

## TODO

* There is a yellow selection border in webkit browser. Trying to remove in next release.


------------

##jQuery UI Bootstrap

##Summary

This is a project I started to bring the beauty of Twitter's Bootstrap to jQuery UI widgets.

Twitter's Bootstrap was one of my favorite projects to come out of 2011, but having used it regularly it left me wanting two things:

* The ability to work side-by-side with jQuery UI (something which caused a number of widgets to break visually)
* The ability to theme jQuery UI widgets using Bootstrap styles. Whilst I love jQuery UI, I (like others) find some of the current themes to look a little dated. My hope is that this theme provides a decent alternative for others that feel the same.

To clarify, this project doesn't aim or intend to replace Twitter Bootstrap. It merely provides a jQuery UI-compatible theme inspired by Bootstrap's design. It also provides a version of Bootstrap CSS with a few (minor) sections commented out which enable the theme to work along-side it.

I welcome any and all feedback as I'd very much like this theme to be as solid as possible.

##Browser-support

All modern browsers are targeted by this theme with 'lo-res' experiences (i.e no gradients, border-radius etc.) provided for users using older browsers.

There *are* some minor known issues lingering that I'm working on, but the hope is that in time those will all get ironed out.

##jQuery UI support

This theme targets jQuery UI 1.8.16 and the default version of jQuery included in the (current) jQuery UI builds (jQuery 1.6.2). I'm aware of jQuery 1.7.1 and intend on upgrading anything necessary in the theme to use it when the jQuery UI team officially include it in their theme packs.


##Demo

For a live preview of the theme, see [http://addyosmani.github.com/jquery-ui-bootstrap](http://addyosmani.github.com/jquery-ui-bootstrap).

A [blog post](http://addyosmani.com/blog/jquery-ui-bootstrap/) with some more details about the project is also available.
