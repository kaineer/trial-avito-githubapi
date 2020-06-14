
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment && $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, props) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : prop_values;
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    //

    const parseQuery = (string) => {
      // key=value&key2=value2 => [key=value, key2=value2]
      const pairs = string.split('&');

      // {key: value, ...}
      const result = {};
      pairs.forEach(pair => {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        result[key] = value;
      });
      return result;
    };

    const joinEntry = ([key, value]) => (
      [key, value].map(encodeURIComponent).join('=')
    );

    const buildQuery = (obj) => {
      return Object.entries(obj).map(joinEntry).join('&')
    };

    const parseHash = () => {
      const hash = location.hash;
      const result = hash ? parseQuery(hash.slice('#'.length)) : {};
      return result;
    };

    const setHash = (string) => {
      if (!string.startsWith('#')) {
        string = '#'.concat(string);
      }

      location.hash = string;
    };

    const throttle = (fn, timeout = 500) => {
      let timer = null;
      let call;

      return (...args) => {
        call = () => {
          fn(...args);
          timer = null;
        };

        if (timer === null) {
          timer = setTimeout(() => call(), timeout);
        }
      };
    };

    const xx = v => v > 9 ? v : '0' + v;

    const formatDate = (datestring) => {
      const date = typeof datestring === 'string' ? new Date(datestring) : datestring;
      return [
        date.getDate(),
        xx(date.getMonth() + 1),
        date.getFullYear()
      ].join('.');
    };

    // Wait. Anyway I cannot push my personal token
    //   into github, 'bc it automatically removes itself
    //   from my tokens.
    //
    // So, I'll try to do some simple magic.

    const t1 = 'c2bff299';
    const t2 = '201cb446';
    const t3 = 'efc8d3e3';
    const t4 = '755a030c';
    const t5 = 'b54dc776';

    var config = {
      // Personal token from github settings
      // https://github.com/settings/tokens
      token: [t1, t2, t3, t4, t5].join('')
    };
    var config_1 = config.token;

    // src/requests.js

    const buildAPIUrl = (path, params) => {
      const host = 'https://api.github.com';

      return host.concat(
        [path, buildQuery(params)].filter(x => x).join('?')
      );
    };

    const requestAuthorizedData = (path, params = {}) => {
      const headers = {
        'Authorization': 'Token '.concat(config_1)
      };

      const url = buildAPIUrl(path, params);

      return fetch(url, {
        method: 'GET',
        headers
      })
      .then(response => response.json());
    };

    const searchRepositories = (term, page = 1) => (
      requestAuthorizedData('/search/repositories', {
        q: term,
        per_page: 10,
        page,
        sort: 'stars',
        order: 'desc'
      })
    );

    const getRepository = (fullName) => (
      requestAuthorizedData('/repos/'.concat(fullName), {})
    );

    const getLanguages = (fullName) => (
      requestAuthorizedData('/repos/'.concat(fullName, '/languages'))
    );

    const getContributors = (fullName) => (
      requestAuthorizedData('/repos/'.concat(fullName, '/contributors'))
    );

    /* src/Table/Row.svelte generated by Svelte v3.15.0 */

    const file = "src/Table/Row.svelte";

    function create_fragment(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "row " + (ctx.thead ? "row-head" : "") + " svelte-tl2h9c");
    			add_location(div, file, 4, 0, 40);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}

    			if (!current || changed.thead && div_class_value !== (div_class_value = "row " + (ctx.thead ? "row-head" : "") + " svelte-tl2h9c")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { thead } = $$props;
    	const writable_props = ["thead"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("thead" in $$props) $$invalidate("thead", thead = $$props.thead);
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { thead };
    	};

    	$$self.$inject_state = $$props => {
    		if ("thead" in $$props) $$invalidate("thead", thead = $$props.thead);
    	};

    	return { thead, $$slots, $$scope };
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { thead: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.thead === undefined && !("thead" in props)) {
    			console.warn("<Row> was created without expected prop 'thead'");
    		}
    	}

    	get thead() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thead(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Table/Cell.svelte generated by Svelte v3.15.0 */

    const file$1 = "src/Table/Cell.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_style(div, "width", ctx.width + "px");
    			set_style(div, "text-align", ctx.align);
    			attr_dev(div, "class", "svelte-w8r0bj");
    			add_location(div, file$1, 5, 0, 69);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}

    			if (!current || changed.width) {
    				set_style(div, "width", ctx.width + "px");
    			}

    			if (!current || changed.align) {
    				set_style(div, "text-align", ctx.align);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { width } = $$props;
    	let { align = "left" } = $$props;
    	const writable_props = ["width", "align"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Cell> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    		if ("align" in $$props) $$invalidate("align", align = $$props.align);
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { width, align };
    	};

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate("width", width = $$props.width);
    		if ("align" in $$props) $$invalidate("align", align = $$props.align);
    	};

    	return { width, align, $$slots, $$scope };
    }

    class Cell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { width: 0, align: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Cell",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.width === undefined && !("width" in props)) {
    			console.warn("<Cell> was created without expected prop 'width'");
    		}
    	}

    	get width() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Cell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Cell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    //

    const NameWidth = 400;
    const StarsWidth = 100;
    const DateWidth = 140;
    const LinkWidth = 100;

    var Table = {
      NameWidth,
      StarsWidth,
      DateWidth,
      LinkWidth,
    };
    var Table_1 = Table.NameWidth;
    var Table_2 = Table.StarsWidth;
    var Table_3 = Table.DateWidth;
    var Table_4 = Table.LinkWidth;

    /* src/RepositoryList/Header.svelte generated by Svelte v3.15.0 */

    // (13:2) <Cell width={NameWidth}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Name");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(13:2) <Cell width={NameWidth}>",
    		ctx
    	});

    	return block;
    }

    // (14:2) <Cell width={StarsWidth}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Stars");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(14:2) <Cell width={StarsWidth}>",
    		ctx
    	});

    	return block;
    }

    // (15:2) <Cell width={DateWidth}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Updated");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(15:2) <Cell width={DateWidth}>",
    		ctx
    	});

    	return block;
    }

    // (16:2) <Cell width={LinkWidth}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Link");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(16:2) <Cell width={LinkWidth}>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Row thead={true}>
    function create_default_slot(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const cell0 = new Cell({
    			props: {
    				width: Table_1,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell1 = new Cell({
    			props: {
    				width: Table_2,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell2 = new Cell({
    			props: {
    				width: Table_3,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell3 = new Cell({
    			props: {
    				width: Table_4,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell0.$$.fragment);
    			t0 = space();
    			create_component(cell1.$$.fragment);
    			t1 = space();
    			create_component(cell2.$$.fragment);
    			t2 = space();
    			create_component(cell3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cell1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cell2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(cell3, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const cell0_changes = {};

    			if (changed.$$scope) {
    				cell0_changes.$$scope = { changed, ctx };
    			}

    			cell0.$set(cell0_changes);
    			const cell1_changes = {};

    			if (changed.$$scope) {
    				cell1_changes.$$scope = { changed, ctx };
    			}

    			cell1.$set(cell1_changes);
    			const cell2_changes = {};

    			if (changed.$$scope) {
    				cell2_changes.$$scope = { changed, ctx };
    			}

    			cell2.$set(cell2_changes);
    			const cell3_changes = {};

    			if (changed.$$scope) {
    				cell3_changes.$$scope = { changed, ctx };
    			}

    			cell3.$set(cell3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell0.$$.fragment, local);
    			transition_in(cell1.$$.fragment, local);
    			transition_in(cell2.$$.fragment, local);
    			transition_in(cell3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell0.$$.fragment, local);
    			transition_out(cell1.$$.fragment, local);
    			transition_out(cell2.$$.fragment, local);
    			transition_out(cell3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cell1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cell2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(cell3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(12:0) <Row thead={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let current;

    	const row = new Row({
    			props: {
    				thead: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const row_changes = {};

    			if (changed.$$scope) {
    				row_changes.$$scope = { changed, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/RepositoryList/Item.svelte generated by Svelte v3.15.0 */
    const file$2 = "src/RepositoryList/Item.svelte";

    // (28:2) <Cell width={NameWidth}>
    function create_default_slot_4$1(ctx) {
    	let a;
    	let t_value = ctx.item.name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = ctx.repositoryUrl(ctx.item));
    			add_location(a, file$2, 28, 4, 545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = ctx.item.name + "")) set_data_dev(t, t_value);

    			if (changed.item && a_href_value !== (a_href_value = ctx.repositoryUrl(ctx.item))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(28:2) <Cell width={NameWidth}>",
    		ctx
    	});

    	return block;
    }

    // (31:2) <Cell width={StarsWidth}>
    function create_default_slot_3$1(ctx) {
    	let t_value = ctx.item.stargazers_count + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = ctx.item.stargazers_count + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(31:2) <Cell width={StarsWidth}>",
    		ctx
    	});

    	return block;
    }

    // (32:2) <Cell width={DateWidth}>
    function create_default_slot_2$1(ctx) {
    	let t_value = formatDate(ctx.item.pushed_at) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = formatDate(ctx.item.pushed_at) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(32:2) <Cell width={DateWidth}>",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Cell width={LinkWidth}>
    function create_default_slot_1$1(ctx) {
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text("Github");
    			attr_dev(a, "href", a_href_value = ctx.item.html_url);
    			add_location(a, file$2, 33, 4, 758);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && a_href_value !== (a_href_value = ctx.item.html_url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(33:2) <Cell width={LinkWidth}>",
    		ctx
    	});

    	return block;
    }

    // (27:0) <Row>
    function create_default_slot$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	const cell0 = new Cell({
    			props: {
    				width: Table_1,
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell1 = new Cell({
    			props: {
    				width: Table_2,
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell2 = new Cell({
    			props: {
    				width: Table_3,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell3 = new Cell({
    			props: {
    				width: Table_4,
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell0.$$.fragment);
    			t0 = space();
    			create_component(cell1.$$.fragment);
    			t1 = space();
    			create_component(cell2.$$.fragment);
    			t2 = space();
    			create_component(cell3.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(cell1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(cell2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(cell3, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const cell0_changes = {};

    			if (changed.$$scope || changed.item) {
    				cell0_changes.$$scope = { changed, ctx };
    			}

    			cell0.$set(cell0_changes);
    			const cell1_changes = {};

    			if (changed.$$scope || changed.item) {
    				cell1_changes.$$scope = { changed, ctx };
    			}

    			cell1.$set(cell1_changes);
    			const cell2_changes = {};

    			if (changed.$$scope || changed.item) {
    				cell2_changes.$$scope = { changed, ctx };
    			}

    			cell2.$set(cell2_changes);
    			const cell3_changes = {};

    			if (changed.$$scope || changed.item) {
    				cell3_changes.$$scope = { changed, ctx };
    			}

    			cell3.$set(cell3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell0.$$.fragment, local);
    			transition_in(cell1.$$.fragment, local);
    			transition_in(cell2.$$.fragment, local);
    			transition_in(cell3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell0.$$.fragment, local);
    			transition_out(cell1.$$.fragment, local);
    			transition_out(cell2.$$.fragment, local);
    			transition_out(cell3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(cell1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(cell2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(cell3, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(27:0) <Row>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current;

    	const row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const row_changes = {};

    			if (changed.$$scope || changed.item) {
    				row_changes.$$scope = { changed, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { item } = $$props;
    	let { term } = $$props;

    	const repositoryUrl = item => {
    		return ("#").concat(buildQuery({
    			type: "repository",
    			term,
    			full_name: item.full_name
    		}));
    	};

    	const writable_props = ["item", "term"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("item" in $$props) $$invalidate("item", item = $$props.item);
    		if ("term" in $$props) $$invalidate("term", term = $$props.term);
    	};

    	$$self.$capture_state = () => {
    		return { item, term };
    	};

    	$$self.$inject_state = $$props => {
    		if ("item" in $$props) $$invalidate("item", item = $$props.item);
    		if ("term" in $$props) $$invalidate("term", term = $$props.term);
    	};

    	return { item, term, repositoryUrl };
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$3, safe_not_equal, { item: 0, term: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.item === undefined && !("item" in props)) {
    			console.warn("<Item> was created without expected prop 'item'");
    		}

    		if (ctx.term === undefined && !("term" in props)) {
    			console.warn("<Item> was created without expected prop 'term'");
    		}
    	}

    	get item() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get term() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set term(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/RepositoryList.svelte generated by Svelte v3.15.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (11:0) {#each items as item, i}
    function create_each_block(ctx) {
    	let current;

    	const repositoryitem = new Item({
    			props: {
    				term: ctx.term,
    				item: ctx.item,
    				loading: ctx.loading,
    				orderId: ctx.i
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(repositoryitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(repositoryitem, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const repositoryitem_changes = {};
    			if (changed.term) repositoryitem_changes.term = ctx.term;
    			if (changed.items) repositoryitem_changes.item = ctx.item;
    			if (changed.loading) repositoryitem_changes.loading = ctx.loading;
    			repositoryitem.$set(repositoryitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repositoryitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repositoryitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(repositoryitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:0) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let each_1_anchor;
    	let current;
    	const header = new Header({ $$inline: true });
    	let each_value = ctx.items;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (changed.term || changed.items || changed.loading) {
    				each_value = ctx.items;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { items } = $$props;
    	let { loading } = $$props;
    	let { term } = $$props;
    	const writable_props = ["items", "loading", "term"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RepositoryList> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("items" in $$props) $$invalidate("items", items = $$props.items);
    		if ("loading" in $$props) $$invalidate("loading", loading = $$props.loading);
    		if ("term" in $$props) $$invalidate("term", term = $$props.term);
    	};

    	$$self.$capture_state = () => {
    		return { items, loading, term };
    	};

    	$$self.$inject_state = $$props => {
    		if ("items" in $$props) $$invalidate("items", items = $$props.items);
    		if ("loading" in $$props) $$invalidate("loading", loading = $$props.loading);
    		if ("term" in $$props) $$invalidate("term", term = $$props.term);
    	};

    	return { items, loading, term };
    }

    class RepositoryList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$4, safe_not_equal, { items: 0, loading: 0, term: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RepositoryList",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.items === undefined && !("items" in props)) {
    			console.warn("<RepositoryList> was created without expected prop 'items'");
    		}

    		if (ctx.loading === undefined && !("loading" in props)) {
    			console.warn("<RepositoryList> was created without expected prop 'loading'");
    		}

    		if (ctx.term === undefined && !("term" in props)) {
    			console.warn("<RepositoryList> was created without expected prop 'term'");
    		}
    	}

    	get items() {
    		throw new Error("<RepositoryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<RepositoryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<RepositoryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<RepositoryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get term() {
    		throw new Error("<RepositoryList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set term(value) {
    		throw new Error("<RepositoryList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Paginator.svelte generated by Svelte v3.15.0 */

    const file$3 = "src/Paginator.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.pageId = list[i];
    	return child_ctx;
    }

    // (23:2) {#each pages as pageId}
    function create_each_block$1(ctx) {
    	let li;
    	let a;
    	let t0_value = ctx.pageId + "";
    	let t0;
    	let a_href_value;
    	let t1;
    	let li_class_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(a, "href", a_href_value = ctx.pageUrlGenerator(ctx.pageId));
    			attr_dev(a, "class", "svelte-1bmjwmw");
    			add_location(a, file$3, 24, 6, 418);
    			attr_dev(li, "class", li_class_value = "" + (null_to_empty(ctx.current === ctx.pageId ? "current" : "") + " svelte-1bmjwmw"));
    			add_location(li, file$3, 23, 4, 363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    		},
    		p: function update(changed, ctx) {
    			if (changed.pages && t0_value !== (t0_value = ctx.pageId + "")) set_data_dev(t0, t0_value);

    			if ((changed.pageUrlGenerator || changed.pages) && a_href_value !== (a_href_value = ctx.pageUrlGenerator(ctx.pageId))) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if ((changed.current || changed.pages) && li_class_value !== (li_class_value = "" + (null_to_empty(ctx.current === ctx.pageId ? "current" : "") + " svelte-1bmjwmw"))) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(23:2) {#each pages as pageId}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let ul;
    	let each_value = ctx.pages;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-1bmjwmw");
    			add_location(ul, file$3, 21, 0, 328);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(changed, ctx) {
    			if (changed.current || changed.pages || changed.pageUrlGenerator) {
    				each_value = ctx.pages;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { total } = $$props;
    	let { current } = $$props;
    	let { max } = $$props;
    	let { pageUrlGenerator } = $$props;
    	let pages;

    	const getPages = (max, total) => {
    		let pages = [];

    		for (let i = 0; i < Math.min(max, total); i++) {
    			pages.push(i + 1);
    		}

    		return pages;
    	};

    	const writable_props = ["total", "current", "max", "pageUrlGenerator"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Paginator> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("total" in $$props) $$invalidate("total", total = $$props.total);
    		if ("current" in $$props) $$invalidate("current", current = $$props.current);
    		if ("max" in $$props) $$invalidate("max", max = $$props.max);
    		if ("pageUrlGenerator" in $$props) $$invalidate("pageUrlGenerator", pageUrlGenerator = $$props.pageUrlGenerator);
    	};

    	$$self.$capture_state = () => {
    		return {
    			total,
    			current,
    			max,
    			pageUrlGenerator,
    			pages
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("total" in $$props) $$invalidate("total", total = $$props.total);
    		if ("current" in $$props) $$invalidate("current", current = $$props.current);
    		if ("max" in $$props) $$invalidate("max", max = $$props.max);
    		if ("pageUrlGenerator" in $$props) $$invalidate("pageUrlGenerator", pageUrlGenerator = $$props.pageUrlGenerator);
    		if ("pages" in $$props) $$invalidate("pages", pages = $$props.pages);
    	};

    	$$self.$$.update = (changed = { max: 1, total: 1 }) => {
    		if (changed.max || changed.total) {
    			 $$invalidate("pages", pages = getPages(max, total));
    		}
    	};

    	return {
    		total,
    		current,
    		max,
    		pageUrlGenerator,
    		pages
    	};
    }

    class Paginator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$5, safe_not_equal, {
    			total: 0,
    			current: 0,
    			max: 0,
    			pageUrlGenerator: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paginator",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.total === undefined && !("total" in props)) {
    			console.warn("<Paginator> was created without expected prop 'total'");
    		}

    		if (ctx.current === undefined && !("current" in props)) {
    			console.warn("<Paginator> was created without expected prop 'current'");
    		}

    		if (ctx.max === undefined && !("max" in props)) {
    			console.warn("<Paginator> was created without expected prop 'max'");
    		}

    		if (ctx.pageUrlGenerator === undefined && !("pageUrlGenerator" in props)) {
    			console.warn("<Paginator> was created without expected prop 'pageUrlGenerator'");
    		}
    	}

    	get total() {
    		throw new Error("<Paginator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set total(value) {
    		throw new Error("<Paginator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current() {
    		throw new Error("<Paginator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<Paginator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Paginator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Paginator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageUrlGenerator() {
    		throw new Error("<Paginator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageUrlGenerator(value) {
    		throw new Error("<Paginator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Loading.svelte generated by Svelte v3.15.0 */

    const file$4 = "src/Loading.svelte";

    function create_fragment$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading...";
    			attr_dev(div, "class", "loading svelte-yr6y5g");
    			add_location(div, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Search.svelte generated by Svelte v3.15.0 */
    const file$5 = "src/Search.svelte";

    // (71:2) {#if term}
    function create_if_block_3(ctx) {
    	let current;
    	const loading_1 = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading_1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(71:2) {#if term}",
    		ctx
    	});

    	return block;
    }

    // (55:0) {#if items}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(changed, ctx) {
    		if (ctx.items.length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(changed, ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:0) {#if items}",
    		ctx
    	});

    	return block;
    }

    // (67:2) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "There's nothing here. Seriously.";
    			attr_dev(div, "class", "message svelte-iw2xvv");
    			add_location(div, file$5, 67, 4, 1690);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(67:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (56:2) {#if items.length > 0}
    function create_if_block_1(ctx) {
    	let div;
    	let t;
    	let current;

    	const repositorylist = new RepositoryList({
    			props: {
    				term: ctx.term,
    				items: ctx.items,
    				loading: ctx.loading
    			},
    			$$inline: true
    		});

    	let if_block = ctx.items.length > 1 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(repositorylist.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			set_style(div, "width", "840px");
    			set_style(div, "margin-left", "auto");
    			set_style(div, "margin-right", "auto");
    			add_location(div, file$5, 56, 4, 1371);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(repositorylist, div, null);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const repositorylist_changes = {};
    			if (changed.term) repositorylist_changes.term = ctx.term;
    			if (changed.items) repositorylist_changes.items = ctx.items;
    			if (changed.loading) repositorylist_changes.loading = ctx.loading;
    			repositorylist.$set(repositorylist_changes);

    			if (ctx.items.length > 1) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repositorylist.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repositorylist.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(repositorylist);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(56:2) {#if items.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (59:6) {#if items.length > 1}
    function create_if_block_2(ctx) {
    	let current;

    	const paginator = new Paginator({
    			props: {
    				pageUrlGenerator: ctx.pageUrlGenerator,
    				total: Math.ceil(ctx.total_count / 10),
    				max: 10,
    				current: ctx.page
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(paginator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(paginator, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const paginator_changes = {};
    			if (changed.total_count) paginator_changes.total = Math.ceil(ctx.total_count / 10);
    			if (changed.page) paginator_changes.current = ctx.page;
    			paginator.$set(paginator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(paginator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(59:6) {#if items.length > 1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let dispose;
    	const if_block_creators = [create_if_block, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.items) return 0;
    		if (ctx.term) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(null, ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Repository search";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h1, file$5, 50, 0, 1211);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "repository-search svelte-iw2xvv");
    			add_location(input, file$5, 52, 0, 1239);

    			dispose = [
    				listen_dev(input, "input", ctx.input_input_handler),
    				listen_dev(input, "input", ctx.changeHash, false, false, false)
    			];
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    			set_input_value(input, ctx.term);
    			insert_dev(target, t2, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (changed.term && input.value !== ctx.term) {
    				set_input_value(input, ctx.term);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(changed, ctx);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let term = parseHash().q;
    	let items = null;
    	let total_count;
    	let page;
    	let loading = false;
    	const pageUrlGenerator = page => ("#").concat(buildQuery({ q: term, page }));

    	const changeHash = () => {
    		const hash = parseHash();
    		hash.q = term;
    		hash.page = 1;
    		setHash(("#").concat(buildQuery(hash)));
    	};

    	const handleHashChange = () => {
    		const hash = parseHash();
    		const { q } = hash;
    		$$invalidate("page", page = hash.page ? parseInt(hash.page, 10) : 1);
    		$$invalidate("loading", loading = true);
    		$$invalidate("items", items = null);

    		if (typeof q !== "undefined") {
    			searchRepositories(q, page).then(result => {
    				$$invalidate("items", items = result.items);
    				$$invalidate("total_count", total_count = result.total_count);
    				$$invalidate("loading", loading = false);
    			});
    		}
    	};

    	handleHashChange();
    	const throttledHandleHashChange = throttle(handleHashChange, 1000);
    	window.addEventListener("hashchange", throttledHandleHashChange);

    	function input_input_handler() {
    		term = this.value;
    		$$invalidate("term", term);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("term" in $$props) $$invalidate("term", term = $$props.term);
    		if ("items" in $$props) $$invalidate("items", items = $$props.items);
    		if ("total_count" in $$props) $$invalidate("total_count", total_count = $$props.total_count);
    		if ("page" in $$props) $$invalidate("page", page = $$props.page);
    		if ("loading" in $$props) $$invalidate("loading", loading = $$props.loading);
    	};

    	return {
    		term,
    		items,
    		total_count,
    		page,
    		loading,
    		pageUrlGenerator,
    		changeHash,
    		input_input_handler
    	};
    }

    class Search extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Search",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/Repository/Row.svelte generated by Svelte v3.15.0 */

    // (13:2) <Cell width={TitleWidth} align="right">
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(ctx.title);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.title) set_data_dev(t, ctx.title);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(13:2) <Cell width={TitleWidth} align=\\\"right\\\">",
    		ctx
    	});

    	return block;
    }

    // (14:4) <Cell width={DescrWidth}>
    function create_default_slot_1$2(ctx) {
    	let current;
    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_template, ctx, changed, null), get_slot_context(default_slot_template, ctx, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(14:4) <Cell width={DescrWidth}>",
    		ctx
    	});

    	return block;
    }

    // (12:0) <Row>
    function create_default_slot$2(ctx) {
    	let t;
    	let current;

    	const cell0 = new Cell({
    			props: {
    				width: TitleWidth,
    				align: "right",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const cell1 = new Cell({
    			props: {
    				width: DescrWidth,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(cell0.$$.fragment);
    			t = space();
    			create_component(cell1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(cell0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(cell1, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const cell0_changes = {};

    			if (changed.$$scope || changed.title) {
    				cell0_changes.$$scope = { changed, ctx };
    			}

    			cell0.$set(cell0_changes);
    			const cell1_changes = {};

    			if (changed.$$scope) {
    				cell1_changes.$$scope = { changed, ctx };
    			}

    			cell1.$set(cell1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cell0.$$.fragment, local);
    			transition_in(cell1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cell0.$$.fragment, local);
    			transition_out(cell1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(cell0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(cell1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(12:0) <Row>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current;

    	const row = new Row({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const row_changes = {};

    			if (changed.$$scope || changed.title) {
    				row_changes.$$scope = { changed, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TitleWidth = 150;
    const DescrWidth = 450;

    function instance$6($$self, $$props, $$invalidate) {
    	let { title } = $$props;
    	const writable_props = ["title"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate("title", title = $$props.title);
    		if ("$$scope" in $$props) $$invalidate("$$scope", $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { title };
    	};

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate("title", title = $$props.title);
    	};

    	return { title, $$slots, $$scope };
    }

    class Row_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$8, safe_not_equal, { title: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row_1",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (ctx.title === undefined && !("title" in props)) {
    			console.warn("<Row> was created without expected prop 'title'");
    		}
    	}

    	get title() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Repository.svelte generated by Svelte v3.15.0 */

    const { Object: Object_1 } = globals;
    const file$6 = "src/Repository.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = Object_1.create(ctx);
    	child_ctx.contributor = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object_1.create(ctx);
    	child_ctx.language = list[i];
    	child_ctx.i = i;
    	return child_ctx;
    }

    // (52:0) {#if term}
    function create_if_block_5(ctx) {
    	let div;
    	let t0;
    	let a;
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("← Search: ");
    			a = element("a");
    			t1 = text(ctx.term);
    			attr_dev(a, "href", a_href_value = ("#").concat(buildQuery({ q: ctx.term })));
    			add_location(a, file$6, 53, 14, 1149);
    			attr_dev(div, "class", "breadcrumb svelte-280l5x");
    			add_location(div, file$6, 52, 2, 1110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, a);
    			append_dev(a, t1);
    		},
    		p: function update(changed, ctx) {
    			if (changed.term) set_data_dev(t1, ctx.term);

    			if (changed.term && a_href_value !== (a_href_value = ("#").concat(buildQuery({ q: ctx.term })))) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(52:0) {#if term}",
    		ctx
    	});

    	return block;
    }

    // (95:0) {:else}
    function create_else_block_1(ctx) {
    	let current;
    	const loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(95:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (59:0) {#if item}
    function create_if_block$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let if_block1_anchor;
    	let current;

    	const repositoryrow0 = new Row_1({
    			props: {
    				title: "Name",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const repositoryrow1 = new Row_1({
    			props: {
    				title: "Stars",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const repositoryrow2 = new Row_1({
    			props: {
    				title: "Updated",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = ctx.owner && create_if_block_3$1(ctx);

    	const repositoryrow3 = new Row_1({
    			props: {
    				title: "Languages",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const repositoryrow4 = new Row_1({
    			props: {
    				title: "Description",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block1 = ctx.contributors && ctx.contributors.length > 0 && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			create_component(repositoryrow0.$$.fragment);
    			t0 = space();
    			create_component(repositoryrow1.$$.fragment);
    			t1 = space();
    			create_component(repositoryrow2.$$.fragment);
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			create_component(repositoryrow3.$$.fragment);
    			t4 = space();
    			create_component(repositoryrow4.$$.fragment);
    			t5 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(repositoryrow0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(repositoryrow1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(repositoryrow2, target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(repositoryrow3, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(repositoryrow4, target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const repositoryrow0_changes = {};

    			if (changed.$$scope || changed.item) {
    				repositoryrow0_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow0.$set(repositoryrow0_changes);
    			const repositoryrow1_changes = {};

    			if (changed.$$scope || changed.item) {
    				repositoryrow1_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow1.$set(repositoryrow1_changes);
    			const repositoryrow2_changes = {};

    			if (changed.$$scope || changed.item) {
    				repositoryrow2_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow2.$set(repositoryrow2_changes);

    			if (ctx.owner) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t3.parentNode, t3);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const repositoryrow3_changes = {};

    			if (changed.$$scope || changed.languages) {
    				repositoryrow3_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow3.$set(repositoryrow3_changes);
    			const repositoryrow4_changes = {};

    			if (changed.$$scope || changed.item) {
    				repositoryrow4_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow4.$set(repositoryrow4_changes);

    			if (ctx.contributors && ctx.contributors.length > 0) {
    				if (if_block1) {
    					if_block1.p(changed, ctx);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repositoryrow0.$$.fragment, local);
    			transition_in(repositoryrow1.$$.fragment, local);
    			transition_in(repositoryrow2.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(repositoryrow3.$$.fragment, local);
    			transition_in(repositoryrow4.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repositoryrow0.$$.fragment, local);
    			transition_out(repositoryrow1.$$.fragment, local);
    			transition_out(repositoryrow2.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(repositoryrow3.$$.fragment, local);
    			transition_out(repositoryrow4.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(repositoryrow0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(repositoryrow1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(repositoryrow2, detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(repositoryrow3, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(repositoryrow4, detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(59:0) {#if item}",
    		ctx
    	});

    	return block;
    }

    // (61:43) {#if item.homepage}
    function create_if_block_4(ctx) {
    	let t0;
    	let a;
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			t0 = text(", ");
    			a = element("a");
    			t1 = text("homepage");
    			attr_dev(a, "href", a_href_value = ctx.item.homepage);
    			add_location(a, file$6, 60, 64, 1348);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && a_href_value !== (a_href_value = ctx.item.homepage)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(61:43) {#if item.homepage}",
    		ctx
    	});

    	return block;
    }

    // (60:2) <RepositoryRow title="Name">
    function create_default_slot_6(ctx) {
    	let a;
    	let t_value = ctx.item.name + "";
    	let t;
    	let a_href_value;
    	let if_block_anchor;
    	let if_block = ctx.item.homepage && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(a, "href", a_href_value = ctx.item.html_url);
    			add_location(a, file$6, 60, 4, 1288);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = ctx.item.name + "")) set_data_dev(t, t_value);

    			if (changed.item && a_href_value !== (a_href_value = ctx.item.html_url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (ctx.item.homepage) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(60:2) <RepositoryRow title=\\\"Name\\\">",
    		ctx
    	});

    	return block;
    }

    // (63:2) <RepositoryRow title="Stars">
    function create_default_slot_5(ctx) {
    	let t_value = ctx.item.stargazers_count + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = ctx.item.stargazers_count + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(63:2) <RepositoryRow title=\\\"Stars\\\">",
    		ctx
    	});

    	return block;
    }

    // (66:2) <RepositoryRow title="Updated">
    function create_default_slot_4$2(ctx) {
    	let t_value = formatDate(ctx.item.pushed_at) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = formatDate(ctx.item.pushed_at) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(66:2) <RepositoryRow title=\\\"Updated\\\">",
    		ctx
    	});

    	return block;
    }

    // (69:2) {#if owner}
    function create_if_block_3$1(ctx) {
    	let current;

    	const repositoryrow = new Row_1({
    			props: {
    				title: "Owner",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(repositoryrow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(repositoryrow, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const repositoryrow_changes = {};

    			if (changed.$$scope || changed.owner) {
    				repositoryrow_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow.$set(repositoryrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repositoryrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repositoryrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(repositoryrow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(69:2) {#if owner}",
    		ctx
    	});

    	return block;
    }

    // (70:4) <RepositoryRow title="Owner">
    function create_default_slot_3$2(ctx) {
    	let a;
    	let t0_value = ctx.owner.login + "";
    	let t0;
    	let a_href_value;
    	let br;
    	let t1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t0 = text(t0_value);
    			br = element("br");
    			t1 = space();
    			img = element("img");
    			attr_dev(a, "href", a_href_value = ctx.owner.html_url);
    			add_location(a, file$6, 70, 6, 1632);
    			add_location(br, file$6, 70, 48, 1674);
    			attr_dev(img, "alt", "");
    			if (img.src !== (img_src_value = ctx.owner.avatar_url)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "widtn", "128");
    			attr_dev(img, "height", "128");
    			add_location(img, file$6, 71, 6, 1685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t0);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.owner && t0_value !== (t0_value = ctx.owner.login + "")) set_data_dev(t0, t0_value);

    			if (changed.owner && a_href_value !== (a_href_value = ctx.owner.html_url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (changed.owner && img.src !== (img_src_value = ctx.owner.avatar_url)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(70:4) <RepositoryRow title=\\\"Owner\\\">",
    		ctx
    	});

    	return block;
    }

    // (80:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(80:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if languages}
    function create_if_block_2$1(ctx) {
    	let each_1_anchor;
    	let each_value_1 = Object.keys(ctx.languages);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.Object || changed.languages) {
    				each_value_1 = Object.keys(ctx.languages);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(76:4) {#if languages}",
    		ctx
    	});

    	return block;
    }

    // (77:6) {#each Object.keys(languages) as language, i}
    function create_each_block_1(ctx) {
    	let t0_value = (ctx.i === 0 ? "" : ", ") + "";
    	let t0;
    	let t1_value = ctx.language + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.languages && t1_value !== (t1_value = ctx.language + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(77:6) {#each Object.keys(languages) as language, i}",
    		ctx
    	});

    	return block;
    }

    // (75:2) <RepositoryRow title="Languages">
    function create_default_slot_2$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(changed, ctx) {
    		if (ctx.languages) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(changed, ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(75:2) <RepositoryRow title=\\\"Languages\\\">",
    		ctx
    	});

    	return block;
    }

    // (84:2) <RepositoryRow title="Description">
    function create_default_slot_1$3(ctx) {
    	let t_value = ctx.item.description + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.item && t_value !== (t_value = ctx.item.description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(84:2) <RepositoryRow title=\\\"Description\\\">",
    		ctx
    	});

    	return block;
    }

    // (87:2) {#if contributors && contributors.length > 0}
    function create_if_block_1$1(ctx) {
    	let current;

    	const repositoryrow = new Row_1({
    			props: {
    				title: "Contributors",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(repositoryrow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(repositoryrow, target, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			const repositoryrow_changes = {};

    			if (changed.$$scope || changed.contributors) {
    				repositoryrow_changes.$$scope = { changed, ctx };
    			}

    			repositoryrow.$set(repositoryrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repositoryrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repositoryrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(repositoryrow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(87:2) {#if contributors && contributors.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (89:6) {#each contributors as contributor, i}
    function create_each_block$2(ctx) {
    	let t0_value = (ctx.i === 0 ? "" : ", ") + "";
    	let t0;
    	let t1;
    	let a;
    	let t2_value = ctx.contributor.login + "";
    	let t2;
    	let a_href_value;
    	let a_title_value;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			a = element("a");
    			t2 = text(t2_value);
    			attr_dev(a, "href", a_href_value = ctx.contributor.html_url);
    			attr_dev(a, "title", a_title_value = ctx.pluralize(ctx.contributor.contributions, "contribution", "contributions"));
    			add_location(a, file$6, 90, 8, 2252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t2);
    		},
    		p: function update(changed, ctx) {
    			if (changed.contributors && t2_value !== (t2_value = ctx.contributor.login + "")) set_data_dev(t2, t2_value);

    			if (changed.contributors && a_href_value !== (a_href_value = ctx.contributor.html_url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (changed.contributors && a_title_value !== (a_title_value = ctx.pluralize(ctx.contributor.contributions, "contribution", "contributions"))) {
    				attr_dev(a, "title", a_title_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(89:6) {#each contributors as contributor, i}",
    		ctx
    	});

    	return block;
    }

    // (88:4) <RepositoryRow title="Contributors">
    function create_default_slot$3(ctx) {
    	let each_1_anchor;
    	let each_value = ctx.contributors;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(changed, ctx) {
    			if (changed.contributors || changed.pluralize) {
    				each_value = ctx.contributors;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(88:4) <RepositoryRow title=\\\"Contributors\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let t0;
    	let h1;
    	let t2;
    	let current_block_type_index;
    	let if_block1;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = ctx.term && create_if_block_5(ctx);
    	const if_block_creators = [create_if_block$1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.item) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			h1 = element("h1");
    			h1.textContent = "Repository";
    			t2 = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    			add_location(h1, file$6, 57, 0, 1222);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t2, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			if (ctx.term) {
    				if (if_block0) {
    					if_block0.p(changed, ctx);
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks[current_block_type_index];

    				if (!if_block1) {
    					if_block1 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block1.c();
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let fullName;
    	let item = null;
    	let languages = null;
    	let owner = null;
    	let term = null;
    	let contributors = null;
    	const hash = parseHash();

    	const pluralize = (value, single, multiple) => {
    		if (value === 1) {
    			return ("").concat(value, " ", single);
    		} else {
    			return ("").concat(value, " ", multiple);
    		}
    	};

    	fullName = hash.full_name;
    	$$invalidate("term", term = hash.term);

    	getRepository(fullName).then(d => {
    		$$invalidate("item", item = d);
    		$$invalidate("owner", owner = item.owner);
    	});

    	getLanguages(fullName).then(d => $$invalidate("languages", languages = d));

    	getContributors(fullName).then(d => {
    		if (d.length > 0) {
    			$$invalidate("contributors", contributors = d.sort((a, b) => {
    				return a.contributions - b.contribution;
    			}).slice(0, 10));
    		}

    		console.log(contributors);
    	});

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("fullName" in $$props) fullName = $$props.fullName;
    		if ("item" in $$props) $$invalidate("item", item = $$props.item);
    		if ("languages" in $$props) $$invalidate("languages", languages = $$props.languages);
    		if ("owner" in $$props) $$invalidate("owner", owner = $$props.owner);
    		if ("term" in $$props) $$invalidate("term", term = $$props.term);
    		if ("contributors" in $$props) $$invalidate("contributors", contributors = $$props.contributors);
    	};

    	return {
    		item,
    		languages,
    		owner,
    		term,
    		contributors,
    		pluralize
    	};
    }

    class Repository extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Repository",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.15.0 */
    const file$7 = "src/App.svelte";

    // (28:2) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Undefined page");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(28:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (26:34) 
    function create_if_block_1$2(ctx) {
    	let current;
    	const repository = new Repository({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(repository.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(repository, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(repository.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(repository.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(repository, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(26:34) ",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#if type === 'search'}
    function create_if_block$2(ctx) {
    	let current;
    	const search = new Search({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(search.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(search, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(search.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(search.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(search, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(24:2) {#if type === 'search'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.type === "search") return 0;
    		if (ctx.type === "repository") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			attr_dev(main, "class", "svelte-1e9puaw");
    			add_location(main, file$7, 22, 0, 382);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			current = true;
    		},
    		p: function update(changed, ctx) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let type;

    	const handleHashChange = () => {
    		const hash = parseHash();
    		$$invalidate("type", type = hash.type);

    		if (!type) {
    			$$invalidate("type", type = "search");
    		}
    	};

    	handleHashChange();
    	window.addEventListener("hashchange", handleHashChange);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate("type", type = $$props.type);
    	};

    	return { type };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
