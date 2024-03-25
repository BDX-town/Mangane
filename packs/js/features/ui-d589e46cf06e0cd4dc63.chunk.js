(self["webpackChunkmangane_fe"] = self["webpackChunkmangane_fe"] || []).push([[75],{

/***/ 1845:
/*!***************************************************!*\
  !*** ./node_modules/wicg-inert/dist/inert.esm.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
/**
 * This work is licensed under the W3C Software and Document License
 * (http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document).
 */


(function () {
  // Return early if we're not running inside of the browser.
  if (typeof window === 'undefined') {
    return;
  } // Convenience function for converting NodeLists.

  /** @type {typeof Array.prototype.slice} */


  var slice = Array.prototype.slice;
  /**
   * IE has a non-standard name for "matches".
   * @type {typeof Element.prototype.matches}
   */

  var matches = Element.prototype.matches || Element.prototype.msMatchesSelector;
  /** @type {string} */

  var _focusableElementsString = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'details', 'summary', 'iframe', 'object', 'embed', '[contenteditable]'].join(',');
  /**
   * `InertRoot` manages a single inert subtree, i.e. a DOM subtree whose root element has an `inert`
   * attribute.
   *
   * Its main functions are:
   *
   * - to create and maintain a set of managed `InertNode`s, including when mutations occur in the
   *   subtree. The `makeSubtreeUnfocusable()` method handles collecting `InertNode`s via registering
   *   each focusable node in the subtree with the singleton `InertManager` which manages all known
   *   focusable nodes within inert subtrees. `InertManager` ensures that a single `InertNode`
   *   instance exists for each focusable node which has at least one inert root as an ancestor.
   *
   * - to notify all managed `InertNode`s when this subtree stops being inert (i.e. when the `inert`
   *   attribute is removed from the root node). This is handled in the destructor, which calls the
   *   `deregister` method on `InertManager` for each managed inert node.
   */


  var InertRoot = function () {
    /**
     * @param {!Element} rootElement The Element at the root of the inert subtree.
     * @param {!InertManager} inertManager The global singleton InertManager object.
     */
    function InertRoot(rootElement, inertManager) {
      _classCallCheck(this, InertRoot);
      /** @type {!InertManager} */


      this._inertManager = inertManager;
      /** @type {!Element} */

      this._rootElement = rootElement;
      /**
       * @type {!Set<!InertNode>}
       * All managed focusable nodes in this InertRoot's subtree.
       */

      this._managedNodes = new Set(); // Make the subtree hidden from assistive technology

      if (this._rootElement.hasAttribute('aria-hidden')) {
        /** @type {?string} */
        this._savedAriaHidden = this._rootElement.getAttribute('aria-hidden');
      } else {
        this._savedAriaHidden = null;
      }

      this._rootElement.setAttribute('aria-hidden', 'true'); // Make all focusable elements in the subtree unfocusable and add them to _managedNodes


      this._makeSubtreeUnfocusable(this._rootElement); // Watch for:
      // - any additions in the subtree: make them unfocusable too
      // - any removals from the subtree: remove them from this inert root's managed nodes
      // - attribute changes: if `tabindex` is added, or removed from an intrinsically focusable
      //   element, make that node a managed node.


      this._observer = new MutationObserver(this._onMutation.bind(this));

      this._observer.observe(this._rootElement, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    /**
     * Call this whenever this object is about to become obsolete.  This unwinds all of the state
     * stored in this object and updates the state of all of the managed nodes.
     */


    _createClass(InertRoot, [{
      key: 'destructor',
      value: function destructor() {
        this._observer.disconnect();

        if (this._rootElement) {
          if (this._savedAriaHidden !== null) {
            this._rootElement.setAttribute('aria-hidden', this._savedAriaHidden);
          } else {
            this._rootElement.removeAttribute('aria-hidden');
          }
        }

        this._managedNodes.forEach(function (inertNode) {
          this._unmanageNode(inertNode.node);
        }, this); // Note we cast the nulls to the ANY type here because:
        // 1) We want the class properties to be declared as non-null, or else we
        //    need even more casts throughout this code. All bets are off if an
        //    instance has been destroyed and a method is called.
        // 2) We don't want to cast "this", because we want type-aware optimizations
        //    to know which properties we're setting.


        this._observer =
        /** @type {?} */
        null;
        this._rootElement =
        /** @type {?} */
        null;
        this._managedNodes =
        /** @type {?} */
        null;
        this._inertManager =
        /** @type {?} */
        null;
      }
      /**
       * @return {!Set<!InertNode>} A copy of this InertRoot's managed nodes set.
       */

    }, {
      key: '_makeSubtreeUnfocusable',

      /**
       * @param {!Node} startNode
       */
      value: function _makeSubtreeUnfocusable(startNode) {
        var _this2 = this;

        composedTreeWalk(startNode, function (node) {
          return _this2._visitNode(node);
        });
        var activeElement = document.activeElement;

        if (!document.body.contains(startNode)) {
          // startNode may be in shadow DOM, so find its nearest shadowRoot to get the activeElement.
          var node = startNode;
          /** @type {!ShadowRoot|undefined} */

          var root = undefined;

          while (node) {
            if (node.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
              root =
              /** @type {!ShadowRoot} */
              node;
              break;
            }

            node = node.parentNode;
          }

          if (root) {
            activeElement = root.activeElement;
          }
        }

        if (startNode.contains(activeElement)) {
          activeElement.blur(); // In IE11, if an element is already focused, and then set to tabindex=-1
          // calling blur() will not actually move the focus.
          // To work around this we call focus() on the body instead.

          if (activeElement === document.activeElement) {
            document.body.focus();
          }
        }
      }
      /**
       * @param {!Node} node
       */

    }, {
      key: '_visitNode',
      value: function _visitNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        var element =
        /** @type {!Element} */
        node; // If a descendant inert root becomes un-inert, its descendants will still be inert because of
        // this inert root, so all of its managed nodes need to be adopted by this InertRoot.

        if (element !== this._rootElement && element.hasAttribute('inert')) {
          this._adoptInertRoot(element);
        }

        if (matches.call(element, _focusableElementsString) || element.hasAttribute('tabindex')) {
          this._manageNode(element);
        }
      }
      /**
       * Register the given node with this InertRoot and with InertManager.
       * @param {!Node} node
       */

    }, {
      key: '_manageNode',
      value: function _manageNode(node) {
        var inertNode = this._inertManager.register(node, this);

        this._managedNodes.add(inertNode);
      }
      /**
       * Unregister the given node with this InertRoot and with InertManager.
       * @param {!Node} node
       */

    }, {
      key: '_unmanageNode',
      value: function _unmanageNode(node) {
        var inertNode = this._inertManager.deregister(node, this);

        if (inertNode) {
          this._managedNodes['delete'](inertNode);
        }
      }
      /**
       * Unregister the entire subtree starting at `startNode`.
       * @param {!Node} startNode
       */

    }, {
      key: '_unmanageSubtree',
      value: function _unmanageSubtree(startNode) {
        var _this3 = this;

        composedTreeWalk(startNode, function (node) {
          return _this3._unmanageNode(node);
        });
      }
      /**
       * If a descendant node is found with an `inert` attribute, adopt its managed nodes.
       * @param {!Element} node
       */

    }, {
      key: '_adoptInertRoot',
      value: function _adoptInertRoot(node) {
        var inertSubroot = this._inertManager.getInertRoot(node); // During initialisation this inert root may not have been registered yet,
        // so register it now if need be.


        if (!inertSubroot) {
          this._inertManager.setInert(node, true);

          inertSubroot = this._inertManager.getInertRoot(node);
        }

        inertSubroot.managedNodes.forEach(function (savedInertNode) {
          this._manageNode(savedInertNode.node);
        }, this);
      }
      /**
       * Callback used when mutation observer detects subtree additions, removals, or attribute changes.
       * @param {!Array<!MutationRecord>} records
       * @param {!MutationObserver} self
       */

    }, {
      key: '_onMutation',
      value: function _onMutation(records, self) {
        records.forEach(function (record) {
          var target =
          /** @type {!Element} */
          record.target;

          if (record.type === 'childList') {
            // Manage added nodes
            slice.call(record.addedNodes).forEach(function (node) {
              this._makeSubtreeUnfocusable(node);
            }, this); // Un-manage removed nodes

            slice.call(record.removedNodes).forEach(function (node) {
              this._unmanageSubtree(node);
            }, this);
          } else if (record.type === 'attributes') {
            if (record.attributeName === 'tabindex') {
              // Re-initialise inert node if tabindex changes
              this._manageNode(target);
            } else if (target !== this._rootElement && record.attributeName === 'inert' && target.hasAttribute('inert')) {
              // If a new inert root is added, adopt its managed nodes and make sure it knows about the
              // already managed nodes from this inert subroot.
              this._adoptInertRoot(target);

              var inertSubroot = this._inertManager.getInertRoot(target);

              this._managedNodes.forEach(function (managedNode) {
                if (target.contains(managedNode.node)) {
                  inertSubroot._manageNode(managedNode.node);
                }
              });
            }
          }
        }, this);
      }
    }, {
      key: 'managedNodes',
      get: function get() {
        return new Set(this._managedNodes);
      }
      /** @return {boolean} */

    }, {
      key: 'hasSavedAriaHidden',
      get: function get() {
        return this._savedAriaHidden !== null;
      }
      /** @param {?string} ariaHidden */

    }, {
      key: 'savedAriaHidden',
      set: function set(ariaHidden) {
        this._savedAriaHidden = ariaHidden;
      }
      /** @return {?string} */
      ,
      get: function get() {
        return this._savedAriaHidden;
      }
    }]);

    return InertRoot;
  }();
  /**
   * `InertNode` initialises and manages a single inert node.
   * A node is inert if it is a descendant of one or more inert root elements.
   *
   * On construction, `InertNode` saves the existing `tabindex` value for the node, if any, and
   * either removes the `tabindex` attribute or sets it to `-1`, depending on whether the element
   * is intrinsically focusable or not.
   *
   * `InertNode` maintains a set of `InertRoot`s which are descendants of this `InertNode`. When an
   * `InertRoot` is destroyed, and calls `InertManager.deregister()`, the `InertManager` notifies the
   * `InertNode` via `removeInertRoot()`, which in turn destroys the `InertNode` if no `InertRoot`s
   * remain in the set. On destruction, `InertNode` reinstates the stored `tabindex` if one exists,
   * or removes the `tabindex` attribute if the element is intrinsically focusable.
   */


  var InertNode = function () {
    /**
     * @param {!Node} node A focusable element to be made inert.
     * @param {!InertRoot} inertRoot The inert root element associated with this inert node.
     */
    function InertNode(node, inertRoot) {
      _classCallCheck(this, InertNode);
      /** @type {!Node} */


      this._node = node;
      /** @type {boolean} */

      this._overrodeFocusMethod = false;
      /**
       * @type {!Set<!InertRoot>} The set of descendant inert roots.
       *    If and only if this set becomes empty, this node is no longer inert.
       */

      this._inertRoots = new Set([inertRoot]);
      /** @type {?number} */

      this._savedTabIndex = null;
      /** @type {boolean} */

      this._destroyed = false; // Save any prior tabindex info and make this node untabbable

      this.ensureUntabbable();
    }
    /**
     * Call this whenever this object is about to become obsolete.
     * This makes the managed node focusable again and deletes all of the previously stored state.
     */


    _createClass(InertNode, [{
      key: 'destructor',
      value: function destructor() {
        this._throwIfDestroyed();

        if (this._node && this._node.nodeType === Node.ELEMENT_NODE) {
          var element =
          /** @type {!Element} */
          this._node;

          if (this._savedTabIndex !== null) {
            element.setAttribute('tabindex', this._savedTabIndex);
          } else {
            element.removeAttribute('tabindex');
          } // Use `delete` to restore native focus method.


          if (this._overrodeFocusMethod) {
            delete element.focus;
          }
        } // See note in InertRoot.destructor for why we cast these nulls to ANY.


        this._node =
        /** @type {?} */
        null;
        this._inertRoots =
        /** @type {?} */
        null;
        this._destroyed = true;
      }
      /**
       * @type {boolean} Whether this object is obsolete because the managed node is no longer inert.
       * If the object has been destroyed, any attempt to access it will cause an exception.
       */

    }, {
      key: '_throwIfDestroyed',

      /**
       * Throw if user tries to access destroyed InertNode.
       */
      value: function _throwIfDestroyed() {
        if (this.destroyed) {
          throw new Error('Trying to access destroyed InertNode');
        }
      }
      /** @return {boolean} */

    }, {
      key: 'ensureUntabbable',

      /** Save the existing tabindex value and make the node untabbable and unfocusable */
      value: function ensureUntabbable() {
        if (this.node.nodeType !== Node.ELEMENT_NODE) {
          return;
        }

        var element =
        /** @type {!Element} */
        this.node;

        if (matches.call(element, _focusableElementsString)) {
          if (
          /** @type {!HTMLElement} */
          element.tabIndex === -1 && this.hasSavedTabIndex) {
            return;
          }

          if (element.hasAttribute('tabindex')) {
            this._savedTabIndex =
            /** @type {!HTMLElement} */
            element.tabIndex;
          }

          element.setAttribute('tabindex', '-1');

          if (element.nodeType === Node.ELEMENT_NODE) {
            element.focus = function () {};

            this._overrodeFocusMethod = true;
          }
        } else if (element.hasAttribute('tabindex')) {
          this._savedTabIndex =
          /** @type {!HTMLElement} */
          element.tabIndex;
          element.removeAttribute('tabindex');
        }
      }
      /**
       * Add another inert root to this inert node's set of managing inert roots.
       * @param {!InertRoot} inertRoot
       */

    }, {
      key: 'addInertRoot',
      value: function addInertRoot(inertRoot) {
        this._throwIfDestroyed();

        this._inertRoots.add(inertRoot);
      }
      /**
       * Remove the given inert root from this inert node's set of managing inert roots.
       * If the set of managing inert roots becomes empty, this node is no longer inert,
       * so the object should be destroyed.
       * @param {!InertRoot} inertRoot
       */

    }, {
      key: 'removeInertRoot',
      value: function removeInertRoot(inertRoot) {
        this._throwIfDestroyed();

        this._inertRoots['delete'](inertRoot);

        if (this._inertRoots.size === 0) {
          this.destructor();
        }
      }
    }, {
      key: 'destroyed',
      get: function get() {
        return (
          /** @type {!InertNode} */
          this._destroyed
        );
      }
    }, {
      key: 'hasSavedTabIndex',
      get: function get() {
        return this._savedTabIndex !== null;
      }
      /** @return {!Node} */

    }, {
      key: 'node',
      get: function get() {
        this._throwIfDestroyed();

        return this._node;
      }
      /** @param {?number} tabIndex */

    }, {
      key: 'savedTabIndex',
      set: function set(tabIndex) {
        this._throwIfDestroyed();

        this._savedTabIndex = tabIndex;
      }
      /** @return {?number} */
      ,
      get: function get() {
        this._throwIfDestroyed();

        return this._savedTabIndex;
      }
    }]);

    return InertNode;
  }();
  /**
   * InertManager is a per-document singleton object which manages all inert roots and nodes.
   *
   * When an element becomes an inert root by having an `inert` attribute set and/or its `inert`
   * property set to `true`, the `setInert` method creates an `InertRoot` object for the element.
   * The `InertRoot` in turn registers itself as managing all of the element's focusable descendant
   * nodes via the `register()` method. The `InertManager` ensures that a single `InertNode` instance
   * is created for each such node, via the `_managedNodes` map.
   */


  var InertManager = function () {
    /**
     * @param {!Document} document
     */
    function InertManager(document) {
      _classCallCheck(this, InertManager);

      if (!document) {
        throw new Error('Missing required argument; InertManager needs to wrap a document.');
      }
      /** @type {!Document} */


      this._document = document;
      /**
       * All managed nodes known to this InertManager. In a map to allow looking up by Node.
       * @type {!Map<!Node, !InertNode>}
       */

      this._managedNodes = new Map();
      /**
       * All inert roots known to this InertManager. In a map to allow looking up by Node.
       * @type {!Map<!Node, !InertRoot>}
       */

      this._inertRoots = new Map();
      /**
       * Observer for mutations on `document.body`.
       * @type {!MutationObserver}
       */

      this._observer = new MutationObserver(this._watchForInert.bind(this)); // Add inert style.

      addInertStyle(document.head || document.body || document.documentElement); // Wait for document to be loaded.

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', this._onDocumentLoaded.bind(this));
      } else {
        this._onDocumentLoaded();
      }
    }
    /**
     * Set whether the given element should be an inert root or not.
     * @param {!Element} root
     * @param {boolean} inert
     */


    _createClass(InertManager, [{
      key: 'setInert',
      value: function setInert(root, inert) {
        if (inert) {
          if (this._inertRoots.has(root)) {
            // element is already inert
            return;
          }

          var inertRoot = new InertRoot(root, this);
          root.setAttribute('inert', '');

          this._inertRoots.set(root, inertRoot); // If not contained in the document, it must be in a shadowRoot.
          // Ensure inert styles are added there.


          if (!this._document.body.contains(root)) {
            var parent = root.parentNode;

            while (parent) {
              if (parent.nodeType === 11) {
                addInertStyle(parent);
              }

              parent = parent.parentNode;
            }
          }
        } else {
          if (!this._inertRoots.has(root)) {
            // element is already non-inert
            return;
          }

          var _inertRoot = this._inertRoots.get(root);

          _inertRoot.destructor();

          this._inertRoots['delete'](root);

          root.removeAttribute('inert');
        }
      }
      /**
       * Get the InertRoot object corresponding to the given inert root element, if any.
       * @param {!Node} element
       * @return {!InertRoot|undefined}
       */

    }, {
      key: 'getInertRoot',
      value: function getInertRoot(element) {
        return this._inertRoots.get(element);
      }
      /**
       * Register the given InertRoot as managing the given node.
       * In the case where the node has a previously existing inert root, this inert root will
       * be added to its set of inert roots.
       * @param {!Node} node
       * @param {!InertRoot} inertRoot
       * @return {!InertNode} inertNode
       */

    }, {
      key: 'register',
      value: function register(node, inertRoot) {
        var inertNode = this._managedNodes.get(node);

        if (inertNode !== undefined) {
          // node was already in an inert subtree
          inertNode.addInertRoot(inertRoot);
        } else {
          inertNode = new InertNode(node, inertRoot);
        }

        this._managedNodes.set(node, inertNode);

        return inertNode;
      }
      /**
       * De-register the given InertRoot as managing the given inert node.
       * Removes the inert root from the InertNode's set of managing inert roots, and remove the inert
       * node from the InertManager's set of managed nodes if it is destroyed.
       * If the node is not currently managed, this is essentially a no-op.
       * @param {!Node} node
       * @param {!InertRoot} inertRoot
       * @return {?InertNode} The potentially destroyed InertNode associated with this node, if any.
       */

    }, {
      key: 'deregister',
      value: function deregister(node, inertRoot) {
        var inertNode = this._managedNodes.get(node);

        if (!inertNode) {
          return null;
        }

        inertNode.removeInertRoot(inertRoot);

        if (inertNode.destroyed) {
          this._managedNodes['delete'](node);
        }

        return inertNode;
      }
      /**
       * Callback used when document has finished loading.
       */

    }, {
      key: '_onDocumentLoaded',
      value: function _onDocumentLoaded() {
        // Find all inert roots in document and make them actually inert.
        var inertElements = slice.call(this._document.querySelectorAll('[inert]'));
        inertElements.forEach(function (inertElement) {
          this.setInert(inertElement, true);
        }, this); // Comment this out to use programmatic API only.

        this._observer.observe(this._document.body || this._document.documentElement, {
          attributes: true,
          subtree: true,
          childList: true
        });
      }
      /**
       * Callback used when mutation observer detects attribute changes.
       * @param {!Array<!MutationRecord>} records
       * @param {!MutationObserver} self
       */

    }, {
      key: '_watchForInert',
      value: function _watchForInert(records, self) {
        var _this = this;

        records.forEach(function (record) {
          switch (record.type) {
            case 'childList':
              slice.call(record.addedNodes).forEach(function (node) {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                  return;
                }

                var inertElements = slice.call(node.querySelectorAll('[inert]'));

                if (matches.call(node, '[inert]')) {
                  inertElements.unshift(node);
                }

                inertElements.forEach(function (inertElement) {
                  this.setInert(inertElement, true);
                }, _this);
              }, _this);
              break;

            case 'attributes':
              if (record.attributeName !== 'inert') {
                return;
              }

              var target =
              /** @type {!Element} */
              record.target;
              var inert = target.hasAttribute('inert');

              _this.setInert(target, inert);

              break;
          }
        }, this);
      }
    }]);

    return InertManager;
  }();
  /**
   * Recursively walk the composed tree from |node|.
   * @param {!Node} node
   * @param {(function (!Element))=} callback Callback to be called for each element traversed,
   *     before descending into child nodes.
   * @param {?ShadowRoot=} shadowRootAncestor The nearest ShadowRoot ancestor, if any.
   */


  function composedTreeWalk(node, callback, shadowRootAncestor) {
    if (node.nodeType == Node.ELEMENT_NODE) {
      var element =
      /** @type {!Element} */
      node;

      if (callback) {
        callback(element);
      } // Descend into node:
      // If it has a ShadowRoot, ignore all child elements - these will be picked
      // up by the <content> or <shadow> elements. Descend straight into the
      // ShadowRoot.


      var shadowRoot =
      /** @type {!HTMLElement} */
      element.shadowRoot;

      if (shadowRoot) {
        composedTreeWalk(shadowRoot, callback, shadowRoot);
        return;
      } // If it is a <content> element, descend into distributed elements - these
      // are elements from outside the shadow root which are rendered inside the
      // shadow DOM.


      if (element.localName == 'content') {
        var content =
        /** @type {!HTMLContentElement} */
        element; // Verifies if ShadowDom v0 is supported.

        var distributedNodes = content.getDistributedNodes ? content.getDistributedNodes() : [];

        for (var i = 0; i < distributedNodes.length; i++) {
          composedTreeWalk(distributedNodes[i], callback, shadowRootAncestor);
        }

        return;
      } // If it is a <slot> element, descend into assigned nodes - these
      // are elements from outside the shadow root which are rendered inside the
      // shadow DOM.


      if (element.localName == 'slot') {
        var slot =
        /** @type {!HTMLSlotElement} */
        element; // Verify if ShadowDom v1 is supported.

        var _distributedNodes = slot.assignedNodes ? slot.assignedNodes({
          flatten: true
        }) : [];

        for (var _i = 0; _i < _distributedNodes.length; _i++) {
          composedTreeWalk(_distributedNodes[_i], callback, shadowRootAncestor);
        }

        return;
      }
    } // If it is neither the parent of a ShadowRoot, a <content> element, a <slot>
    // element, nor a <shadow> element recurse normally.


    var child = node.firstChild;

    while (child != null) {
      composedTreeWalk(child, callback, shadowRootAncestor);
      child = child.nextSibling;
    }
  }
  /**
   * Adds a style element to the node containing the inert specific styles
   * @param {!Node} node
   */


  function addInertStyle(node) {
    if (node.querySelector('style#inert-style, link#inert-style')) {
      return;
    }

    var style = document.createElement('style');
    style.setAttribute('id', 'inert-style');
    style.textContent = '\n' + '[inert] {\n' + '  pointer-events: none;\n' + '  cursor: default;\n' + '}\n' + '\n' + '[inert], [inert] * {\n' + '  -webkit-user-select: none;\n' + '  -moz-user-select: none;\n' + '  -ms-user-select: none;\n' + '  user-select: none;\n' + '}\n';
    node.appendChild(style);
  }

  if (!Element.prototype.hasOwnProperty('inert')) {
    /** @type {!InertManager} */
    var inertManager = new InertManager(document);
    Object.defineProperty(Element.prototype, 'inert', {
      enumerable: true,

      /** @this {!Element} */
      get: function get() {
        return this.hasAttribute('inert');
      },

      /** @this {!Element} */
      set: function set(inert) {
        inertManager.setInert(this, inert);
      }
    });
  }
})();

/***/ }),

/***/ 1798:
/*!************************************!*\
  !*** ./app/soapbox/actions/mrf.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updateMrf": function() { return /* binding */ updateMrf; }
/* harmony export */ });
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var soapbox_utils_config_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! soapbox/utils/config_db */ 182);
/* harmony import */ var _admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin */ 76);



var simplePolicyMerge = function (simplePolicy, host, restrictions) {
    return simplePolicy.map(function (hosts, key) {
        var isRestricted = restrictions.get(key);
        if (isRestricted) {
            return (0,immutable__WEBPACK_IMPORTED_MODULE_2__.Set)(hosts).add(host);
        }
        else {
            return (0,immutable__WEBPACK_IMPORTED_MODULE_2__.Set)(hosts).delete(host);
        }
    });
};
var updateMrf = function (host, restrictions) { return function (dispatch, getState) { return dispatch((0,_admin__WEBPACK_IMPORTED_MODULE_1__.fetchConfig)()).then(function () {
    var configs = getState().admin.get('configs');
    var simplePolicy = soapbox_utils_config_db__WEBPACK_IMPORTED_MODULE_0__["default"].toSimplePolicy(configs);
    var merged = simplePolicyMerge(simplePolicy, host, restrictions);
    var config = soapbox_utils_config_db__WEBPACK_IMPORTED_MODULE_0__["default"].fromSimplePolicy(merged);
    return dispatch((0,_admin__WEBPACK_IMPORTED_MODULE_1__.updateConfig)(config.toJS()));
}); }; };



/***/ }),

/***/ 1619:
/*!***************************************************!*\
  !*** ./app/soapbox/components/birthday-panel.tsx ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/containers/account_container */ 120);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/birthday-panel.tsx";







var timeToMidnight = function () {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    return midnight.getTime() - now.getTime();
};
var BirthdayPanel = function (_ref) {
    var limit = _ref.limit;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var birthdays = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$user_lists$bir;
        return ((_state$user_lists$bir = state.user_lists.birthday_reminders.get(state.me)) === null || _state$user_lists$bir === void 0 ? void 0 : _state$user_lists$bir.items) || (0,immutable__WEBPACK_IMPORTED_MODULE_5__.OrderedSet)();
    });
    var birthdaysToRender = birthdays.slice(0, limit);
    var timeout = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
    var handleFetchBirthdayReminders = function () {
        var _dispatch;
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        (_dispatch = dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_1__.fetchBirthdayReminders)(month, day))) === null || _dispatch === void 0 ? void 0 : _dispatch.then(function () {
            timeout.current = setTimeout(function () { return handleFetchBirthdayReminders(); }, timeToMidnight());
        });
    };
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(function () {
        handleFetchBirthdayReminders();
        return function () {
            if (timeout.current) {
                clearTimeout(timeout.current);
            }
        };
    }, []);
    if (birthdaysToRender.isEmpty()) {
        return null;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
            id: "birthday_panel.title",
            defaultMessage: "Birthdays",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 20
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, birthdaysToRender.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_3__["default"], {
        key: accountId // @ts-ignore: TS thinks `id` is passed to <Account>, but it isn't
        ,
        id: accountId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    }); }));
};
/* harmony default export */ __webpack_exports__["default"] = (BirthdayPanel);


/***/ }),

/***/ 1795:
/*!*********************************************************!*\
  !*** ./app/soapbox/components/extended_video_player.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/is_mobile */ 88);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/extended_video_player.js";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }



var ExtendedVideoPlayer = /** @class */ (function (_super) {
    __extends(ExtendedVideoPlayer, _super);
    function ExtendedVideoPlayer() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "handleLoadedData", function () {
            if (_this.props.time) {
                _this.video.currentTime = _this.props.time;
            }
        });
        _defineProperty(_this, "setRef", function (c) {
            _this.video = c;
        });
        _defineProperty(_this, "handleClick", function (e) {
            e.stopPropagation();
            var handler = _this.props.onClick;
            if (handler)
                handler();
        });
        return _this;
    }
    ExtendedVideoPlayer.prototype.componentDidMount = function () {
        this.video.addEventListener('loadeddata', this.handleLoadedData);
    };
    ExtendedVideoPlayer.prototype.componentWillUnmount = function () {
        this.video.removeEventListener('loadeddata', this.handleLoadedData);
    };
    ExtendedVideoPlayer.prototype.render = function () {
        var _a = this.props, src = _a.src, muted = _a.muted, controls = _a.controls, alt = _a.alt;
        var conditionalAttributes = {};
        if ((0,soapbox_is_mobile__WEBPACK_IMPORTED_MODULE_3__.isIOS)()) {
            conditionalAttributes.playsInline = '1';
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "extended-video-player",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 51,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("video", _extends({
            ref: this.setRef,
            src: src,
            autoPlay: true,
            role: "button",
            tabIndex: "0",
            "aria-label": alt,
            title: alt,
            muted: muted,
            controls: controls,
            loop: !controls,
            onClick: this.handleClick
        }, conditionalAttributes, {
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 52,
                columnNumber: 9
            }
        })));
    };
    return ExtendedVideoPlayer;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent));
/* harmony default export */ __webpack_exports__["default"] = (ExtendedVideoPlayer);
_defineProperty(ExtendedVideoPlayer, "propTypes", {
    src: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    alt: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    width: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
    height: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
    time: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
    controls: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool.isRequired),
    muted: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool.isRequired),
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)
});


/***/ }),

/***/ 1844:
/*!**********************************************!*\
  !*** ./app/soapbox/components/modal_root.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var history__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! history */ 1017);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var wicg_inert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! wicg-inert */ 1845);
/* harmony import */ var wicg_inert__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(wicg_inert__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 55);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/compose */ 30);
/* harmony import */ var _actions_modals__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../actions/modals */ 17);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/modal_root.js";
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols);
} return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); });
} return target; }


function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    confirm: {
        "id": "confirmations.delete.confirm",
        "defaultMessage": "Delete"
    }
});
var checkComposeContent = function (compose) {
    return [compose.text.length > 0, compose.spoiler_text.length > 0, compose.media_attachments.size > 0, compose.in_reply_to !== null, compose.quote !== null, compose.poll !== null].some(function (check) { return check === true; });
};
var mapStateToProps = function (state) { return ({
    hasComposeContent: checkComposeContent(state.compose),
    isEditing: state.compose.id !== null
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onOpenModal: function (type, opts) {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_8__.openModal)(type, opts));
    },
    onCloseModal: function (type) {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_8__.closeModal)(type));
    },
    onCancelReplyCompose: function () {
        dispatch((0,_actions_modals__WEBPACK_IMPORTED_MODULE_8__.closeModal)('COMPOSE'));
        dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_7__.cancelReplyCompose)());
    }
}); };
var ModalRoot = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_10__.withRouter)(_class = (_class2 = /** @class */ (function (_super) {
    __extends(ModalRoot, _super);
    function ModalRoot() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            revealed: !!_this.props.children
        });
        _defineProperty(_this, "activeElement", _this.state.revealed ? document.activeElement : null);
        _defineProperty(_this, "handleKeyUp", function (e) {
            if ((e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) && !!_this.props.children) {
                _this.handleOnClose();
            }
        });
        _defineProperty(_this, "handleOnClose", function () {
            var _a = _this.props, onOpenModal = _a.onOpenModal, onCloseModal = _a.onCloseModal, hasComposeContent = _a.hasComposeContent, isEditing = _a.isEditing, intl = _a.intl, type = _a.type, onCancelReplyCompose = _a.onCancelReplyCompose;
            if (hasComposeContent && type === 'COMPOSE') {
                onOpenModal('CONFIRM', {
                    icon: __webpack_require__(/*! @tabler/icons/trash.svg */ 252),
                    heading: isEditing ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                        id: "confirmations.cancel_editing.heading",
                        defaultMessage: "Cancel post editing",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 82,
                            columnNumber: 30
                        }
                    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                        id: "confirmations.delete.heading",
                        defaultMessage: "Delete post",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 82,
                            columnNumber: 132
                        }
                    }),
                    message: isEditing ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                        id: "confirmations.cancel_editing.message",
                        defaultMessage: "Are you sure you want to cancel editing this post? All changes will be lost.",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 83,
                            columnNumber: 30
                        }
                    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
                        id: "confirmations.delete.message",
                        defaultMessage: "Are you sure you want to delete this post?",
                        __self: _this,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 83,
                            columnNumber: 189
                        }
                    }),
                    confirm: intl.formatMessage(messages.confirm),
                    onConfirm: function () { return onCancelReplyCompose(); },
                    onCancel: function () { return onCloseModal('CONFIRM'); }
                });
            }
            else if (hasComposeContent && type === 'CONFIRM') {
                onCloseModal('CONFIRM');
            }
            else {
                _this.props.onClose();
            }
        });
        _defineProperty(_this, "handleKeyDown", function (e) {
            if (e.key === 'Tab') {
                var focusable = Array.from(_this.node.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter(function (x) { return window.getComputedStyle(x).display !== 'none'; });
                var index = focusable.indexOf(e.target);
                var element = void 0;
                if (e.shiftKey) {
                    element = focusable[index - 1] || focusable[focusable.length - 1];
                }
                else {
                    element = focusable[index + 1] || focusable[0];
                }
                if (element) {
                    element.focus();
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        });
        _defineProperty(_this, "getSiblings", function () {
            return Array.apply(void 0, _this.node.parentElement.childNodes).filter(function (node) { return node !== _this.node; });
        });
        _defineProperty(_this, "setRef", function (ref) {
            _this.node = ref;
        });
        return _this;
    }
    ModalRoot.prototype.componentDidMount = function () {
        window.addEventListener('keyup', this.handleKeyUp, false);
        window.addEventListener('keydown', this.handleKeyDown, false);
        this.history = this.props.history || (0,history__WEBPACK_IMPORTED_MODULE_12__.createBrowserHistory)();
    };
    ModalRoot.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (!!this.props.children && !prevProps.children) {
            this.activeElement = document.activeElement;
            this.getSiblings().forEach(function (sibling) { return sibling.setAttribute('inert', true); });
            this._handleModalOpen();
        }
        else if (!prevProps.children) {
            this.setState({
                revealed: false
            });
        }
        if (!this.props.children && !!prevProps.children) {
            this.activeElement.focus();
            this.activeElement = null;
            this.getSiblings().forEach(function (sibling) { return sibling.removeAttribute('inert'); });
            this._handleModalClose(prevProps.type);
        }
        if (this.props.children) {
            requestAnimationFrame(function () {
                _this.setState({
                    revealed: true
                });
            });
            this._ensureHistoryBuffer();
        }
    };
    ModalRoot.prototype.componentWillUnmount = function () {
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('keydown', this.handleKeyDown);
    };
    ModalRoot.prototype._handleModalOpen = function () {
        var _this = this;
        this._modalHistoryKey = Date.now();
        this.unlistenHistory = this.history.listen(function (_, action) {
            if (action === 'POP') {
                _this.handleOnClose();
                if (_this.props.onCancel)
                    _this.props.onCancel();
            }
        });
    };
    ModalRoot.prototype._handleModalClose = function (type) {
        if (this.unlistenHistory) {
            this.unlistenHistory();
        }
        if (!['FAVOURITES', 'MENTIONS', 'REACTIONS', 'REBLOGS', 'MEDIA'].includes(type)) {
            var state = this.history.location.state;
            if (state && state.soapboxModalKey === this._modalHistoryKey) {
                this.history.goBack();
            }
        }
    };
    ModalRoot.prototype._ensureHistoryBuffer = function () {
        var _a = this.history.location, pathname = _a.pathname, state = _a.state;
        if (!state || state.soapboxModalKey !== this._modalHistoryKey) {
            this.history.push(pathname, _objectSpread(_objectSpread({}, state), {}, {
                soapboxModalKey: this._modalHistoryKey
            }));
        }
    };
    ModalRoot.prototype.render = function () {
        var _a = this.props, children = _a.children, type = _a.type;
        var revealed = this.state.revealed;
        var visible = !!children;
        if (!visible) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
                className: "z-50 transition-all",
                ref: this.setRef,
                style: {
                    opacity: 0
                },
                __self: this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 199,
                    columnNumber: 9
                }
            });
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            ref: this.setRef,
            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
                'fixed top-0 left-0 z-[100] w-full h-full overflow-x-hidden overflow-y-auto': true,
                'pointer-events-none': !visible
            }),
            style: {
                opacity: revealed ? 1 : 0
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 204,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            role: "presentation",
            id: "modal-overlay",
            className: "fixed inset-0 bg-gray-600 bg-opacity-90",
            onClick: this.handleOnClose,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 212,
                columnNumber: 9
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_4__.createElement("div", {
            role: "dialog",
            className: classnames__WEBPACK_IMPORTED_MODULE_2___default()({
                'h-full mx-auto relative pointer-events-none flex items-center': true,
                'md:p-0': type !== 'MEDIA'
            }),
            style: {
                minHeight: 'calc(100% - 3.5rem)'
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 219,
                columnNumber: 9
            }
        }, children));
    };
    return ModalRoot;
}(react__WEBPACK_IMPORTED_MODULE_4__.PureComponent)), _defineProperty(_class2, "propTypes", {
    children: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().node),
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onOpenModal: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onCloseModal: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    onCancelReplyCompose: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func.isRequired),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object.isRequired),
    hasComposeContent: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    isEditing: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().bool),
    type: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().string),
    onCancel: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().func),
    history: (prop_types__WEBPACK_IMPORTED_MODULE_3___default().object)
}), _class2)) || _class;
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_13__["default"])((0,react_redux__WEBPACK_IMPORTED_MODULE_6__.connect)(mapStateToProps, mapDispatchToProps)(ModalRoot)));


/***/ }),

/***/ 1661:
/*!*******************************************************!*\
  !*** ./app/soapbox/components/profile-hover-card.tsx ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProfileHoverCard": function() { return /* binding */ ProfileHoverCard; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_popper__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-popper */ 2470);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_profile_hover_card__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/profile_hover_card */ 449);
/* harmony import */ var soapbox_components_badge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/badge */ 1061);
/* harmony import */ var soapbox_features_ui_components_action_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/ui/components/action-button */ 267);
/* harmony import */ var soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/features/ui/containers/bundle_container */ 57);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 44);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/selectors */ 31);
/* harmony import */ var _hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./hover_ref_wrapper */ 256);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ui */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/profile-hover-card.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
















var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_10__.makeGetAccount)();
var getBadges = function (account) {
    var badges = [];
    if (account.admin) {
        badges.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_badge__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: "admin",
            slug: "admin",
            title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
                id: "account.badges.admin",
                defaultMessage: "Admin",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 31,
                    columnNumber: 56
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 31,
                columnNumber: 17
            }
        }));
    }
    else if (account.moderator) {
        badges.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_badge__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: "moderator",
            slug: "moderator",
            title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
                id: "account.badges.moderator",
                defaultMessage: "Moderator",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 33,
                    columnNumber: 64
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 33,
                columnNumber: 17
            }
        }));
    }
    if (account.getIn(['patron', 'is_patron'])) {
        badges.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_badge__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: "patron",
            slug: "patron",
            title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
                id: "account.badges.patron",
                defaultMessage: "Patron",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 37,
                    columnNumber: 58
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 37,
                columnNumber: 17
            }
        }));
    }
    if (account.donor) {
        badges.push(/*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_badge__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: "donor",
            slug: "donor",
            title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
                id: "account.badges.donor",
                defaultMessage: "Donor",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 41,
                    columnNumber: 56
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
                columnNumber: 17
            }
        }));
    }
    return badges;
};
var handleMouseEnter = function (dispatch) {
    return function () {
        dispatch((0,soapbox_actions_profile_hover_card__WEBPACK_IMPORTED_MODULE_4__.updateProfileHoverCard)());
    };
};
var handleMouseLeave = function (dispatch) {
    return function () {
        dispatch((0,soapbox_actions_profile_hover_card__WEBPACK_IMPORTED_MODULE_4__.closeProfileHoverCard)(true));
    };
};
/** Popup profile preview that appears when hovering avatars and display names. */
var ProfileHoverCard = function (_ref) {
    var _account$relationship;
    var _a = _ref.visible, visible = _a === void 0 ? true : _a;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_14__.useHistory)();
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null), popperElement = _b[0], setPopperElement = _b[1];
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.me; });
    var accountId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.profile_hover_card.accountId || undefined; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return accountId && getAccount(state, accountId); });
    var targetRef = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) {
        var _state$profile_hover_;
        return (_state$profile_hover_ = state.profile_hover_card.ref) === null || _state$profile_hover_ === void 0 ? void 0 : _state$profile_hover_.current;
    });
    var badges = account ? getBadges(account) : [];
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        if (accountId)
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_3__.fetchRelationships)([accountId]));
    }, [dispatch, accountId]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        var unlisten = history.listen(function () {
            _hover_ref_wrapper__WEBPACK_IMPORTED_MODULE_11__.showProfileHoverCard.cancel();
            dispatch((0,soapbox_actions_profile_hover_card__WEBPACK_IMPORTED_MODULE_4__.closeProfileHoverCard)());
        });
        return function () {
            unlisten();
        };
    }, []);
    var _c = (0,react_popper__WEBPACK_IMPORTED_MODULE_15__.usePopper)(targetRef, popperElement), styles = _c.styles, attributes = _c.attributes;
    if (!account)
        return null;
    var accountBio = {
        __html: account.note_emojified
    };
    var followedBy = me !== account.id && ((_account$relationship = account.relationship) === null || _account$relationship === void 0 ? void 0 : _account$relationship.followed_by) === true;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", _extends({
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'absolute transition-opacity w-[320px] z-50 top-0 left-0': true,
            'opacity-100': visible,
            'opacity-0 pointer-events-none': !visible
        }),
        ref: setPopperElement,
        style: styles.popper
    }, attributes.popper, {
        onMouseEnter: handleMouseEnter(dispatch),
        onMouseLeave: handleMouseLeave(dispatch),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 5
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui__WEBPACK_IMPORTED_MODULE_12__.Card, {
        variant: "rounded",
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui__WEBPACK_IMPORTED_MODULE_12__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 111,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui__WEBPACK_IMPORTED_MODULE_12__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 112,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_features_ui_containers_bundle_container__WEBPACK_IMPORTED_MODULE_7__["default"], {
        fetchComponent: soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_8__.UserPanel,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 13
        }
    }, function (Component) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement(Component, {
        accountId: account.get('id'),
        action: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_features_ui_components_action_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
            account: account,
            small: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 117,
                columnNumber: 27
            }
        }),
        badges: badges,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 115,
            columnNumber: 17
        }
    }); }), account.source.get('note', '').length > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui__WEBPACK_IMPORTED_MODULE_12__.Text, {
        size: "sm",
        dangerouslySetInnerHTML: accountBio,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 124,
            columnNumber: 15
        }
    })), followedBy && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "absolute top-2 left-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_badge__WEBPACK_IMPORTED_MODULE_5__["default"], {
        slug: "opaque",
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
            id: "account.follows_you",
            defaultMessage: "Follows you",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 132,
                columnNumber: 24
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 130,
            columnNumber: 15
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (ProfileHoverCard);


/***/ }),

/***/ 1657:
/*!*************************************************!*\
  !*** ./app/soapbox/components/sidebar_menu.tsx ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-router-dom */ 27);
/* harmony import */ var soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/auth */ 34);
/* harmony import */ var soapbox_actions_sidebar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/sidebar */ 450);
/* harmony import */ var soapbox_components_account__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/account */ 202);
/* harmony import */ var soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/site-logo */ 410);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ui */ 2);
/* harmony import */ var soapbox_features_ui_components_profile_stats__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/features/ui/components/profile_stats */ 1431);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/sidebar_menu.tsx";















var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_12__.defineMessages)({
    follow_requests: {
        "id": "navigation_bar.follow_requests",
        "defaultMessage": "Follow requests"
    },
    followers: {
        "id": "account.followers",
        "defaultMessage": "Followers"
    },
    follows: {
        "id": "account.follows",
        "defaultMessage": "Follows"
    },
    profile: {
        "id": "account.profile",
        "defaultMessage": "Profile"
    },
    preferences: {
        "id": "navigation_bar.preferences",
        "defaultMessage": "Preferences"
    },
    soapboxConfig: {
        "id": "navigation_bar.soapbox_config",
        "defaultMessage": "Soapbox config"
    },
    importData: {
        "id": "navigation_bar.import_data",
        "defaultMessage": "Import data"
    },
    accountMigration: {
        "id": "navigation_bar.account_migration",
        "defaultMessage": "Move account"
    },
    accountAliases: {
        "id": "navigation_bar.account_aliases",
        "defaultMessage": "Account aliases"
    },
    logout: {
        "id": "navigation_bar.logout",
        "defaultMessage": "Logout"
    },
    bookmarks: {
        "id": "column.bookmarks",
        "defaultMessage": "Bookmarks"
    },
    lists: {
        "id": "column.lists",
        "defaultMessage": "Lists"
    },
    invites: {
        "id": "navigation_bar.invites",
        "defaultMessage": "Invites"
    },
    developers: {
        "id": "navigation.developers",
        "defaultMessage": "Developers"
    },
    addAccount: {
        "id": "profile_dropdown.add_account",
        "defaultMessage": "Add an existing account"
    },
    direct: {
        "id": "column.direct",
        "defaultMessage": "Direct messages"
    },
    directory: {
        "id": "navigation_bar.profile_directory",
        "defaultMessage": "Profile directory"
    },
    dashboard: {
        "id": "tabs_bar.dashboard",
        "defaultMessage": "Dashboard"
    },
    tags: {
        "id": "navigation_bar.tags",
        "defaultMessage": "Hashtags"
    }
});
var SidebarLink = function (_ref) {
    var href = _ref.href, to = _ref.to, icon = _ref.icon, text = _ref.text, onClick = _ref.onClick, count = _ref.count;
    var body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "bg-primary-50 dark:bg-slate-700 relative rounded inline-flex p-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Icon, {
        src: icon,
        count: count,
        className: "text-primary-600 h-5 w-5",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 57,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Text, {
        tag: "span",
        weight: "medium",
        theme: "muted",
        className: "group-hover:text-gray-800 dark:group-hover:text-gray-200",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 7
        }
    }, text));
    if (to) {
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.NavLink, {
            className: "group py-1 rounded-md",
            to: to,
            onClick: onClick,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 66,
                columnNumber: 7
            }
        }, body);
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("a", {
        className: "group py-1 rounded-md",
        href: href,
        target: "_blank",
        onClick: onClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 5
        }
    }, body);
};
var getOtherAccounts = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_11__.makeGetOtherAccounts)();
var SidebarMenu = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_14__["default"])();
    var dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useDispatch)();
    var logo = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useLogo)();
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useFeatures)();
    var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_11__.makeGetAccount)();
    var instance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.instance; });
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.me; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return me ? getAccount(state, me) : null; });
    var otherAccounts = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return getOtherAccounts(state); });
    var sidebarOpen = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.sidebar.sidebarOpen; });
    var notificationCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.notifications.get('unread'); });
    var chatsCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.chats.items.reduce(function (acc, curr) { return acc + Math.min(curr.unread || 0, 1); }, 0); });
    var followRequestsCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.user_lists.follow_requests.items.count(); });
    var dashboardCount = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_10__.useAppSelector)(function (state) { return state.admin.openReports.count() + state.admin.awaitingApproval.count(); });
    var closeButtonRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
    var _a = react__WEBPACK_IMPORTED_MODULE_2__.useState(false), switcher = _a[0], setSwitcher = _a[1];
    var onClose = function () { return dispatch((0,soapbox_actions_sidebar__WEBPACK_IMPORTED_MODULE_5__.closeSidebar)()); };
    var handleClose = function () {
        setSwitcher(false);
        onClose();
    };
    var handleSwitchAccount = function (account) {
        return function (e) {
            e.preventDefault();
            dispatch((0,soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_4__.switchAccount)(account.id));
        };
    };
    var onClickLogOut = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_4__.logOut)());
    };
    var handleSwitcherClick = function (e) {
        e.preventDefault();
        setSwitcher(function (prevState) { return !prevState; });
    };
    var renderAccount = function (account) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_2__.createElement("a", {
        href: "#",
        className: "block py-2",
        onClick: handleSwitchAccount(account),
        key: account.id,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 131,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "pointer-events-none",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 132,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_account__WEBPACK_IMPORTED_MODULE_6__["default"], {
        account: account,
        showProfileHoverCard: false,
        withRelationship: false,
        withLinkToProfile: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 133,
            columnNumber: 9
        }
    }))); };
    react__WEBPACK_IMPORTED_MODULE_2__.useEffect(function () {
        dispatch((0,soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_4__.fetchOwnAccounts)());
    }, []);
    if (!account || !sidebarOpen)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('sidebar-menu__root', {
            'sidebar-menu__root--visible': sidebarOpen
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 145,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'fixed inset-0 bg-gray-600 bg-opacity-90 z-1000': true,
            'hidden': !sidebarOpen
        }),
        role: "button",
        tabIndex: 0,
        onClick: handleClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 149,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "sidebar-menu flex inset-0 fixed flex-col w-full bg-white dark:bg-slate-800 -translate-x-[100vw] z-1000",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "relative overflow-y-scroll overflow-auto h-full w-full",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 159,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "p-4",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 160,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 161,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 162,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.Link, {
        to: "/",
        onClick: onClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 163,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_site_logo__WEBPACK_IMPORTED_MODULE_7__["default"], {
        alt: "Logo",
        className: "h-5 w-auto cursor-pointer",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 164,
            columnNumber: 19
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.IconButton, {
        title: "close",
        onClick: handleClose,
        src: __webpack_require__(/*! @tabler/icons/x.svg */ 56),
        ref: closeButtonRef,
        className: "text-gray-400 hover:text-gray-600",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 167,
            columnNumber: 17
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Stack, {
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 176,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.Link, {
        to: "/@".concat(account.acct),
        onClick: onClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 177,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_account__WEBPACK_IMPORTED_MODULE_6__["default"], {
        account: account,
        showProfileHoverCard: false,
        withLinkToProfile: false,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 178,
            columnNumber: 19
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 181,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("button", {
        type: "button",
        onClick: handleSwitcherClick,
        className: "py-1",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 182,
            columnNumber: 19
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 183,
            columnNumber: 21
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Text, {
        tag: "span",
        size: "sm",
        weight: "medium",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 184,
            columnNumber: 23
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
        id: "profile_dropdown.switch_account",
        defaultMessage: "Switch accounts",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 185,
            columnNumber: 25
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Icon, {
        src: __webpack_require__(/*! @tabler/icons/chevron-down.svg */ 1130),
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('text-black dark:text-white transition-transform', {
            'rotate-180': switcher
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 188,
            columnNumber: 23
        }
    }))), switcher && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
        className: "border-t border-solid border-gray-200",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 198,
            columnNumber: 21
        }
    }, otherAccounts.map(function (account) { return renderAccount(account); }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_13__.NavLink, {
        className: "flex py-2 space-x-1",
        to: "/login/add",
        onClick: handleClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 201,
            columnNumber: 23
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Icon, {
        className: "dark:text-white",
        src: __webpack_require__(/*! @tabler/icons/plus.svg */ 248),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 202,
            columnNumber: 25
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 203,
            columnNumber: 25
        }
    }, intl.formatMessage(messages.addAccount)))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_features_ui_components_profile_stats__WEBPACK_IMPORTED_MODULE_9__["default"], {
        account: account,
        onClickHandler: handleClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 210,
            columnNumber: 15
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 215,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Divider, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 216,
            columnNumber: 17
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/",
        icon: __webpack_require__(/*! @tabler/icons/home.svg */ 268),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.home",
            defaultMessage: "Home",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 222,
                columnNumber: 25
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 218,
            columnNumber: 17
        }
    }), features.federating ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        icon: logo,
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, instance.get('title')),
        to: "/timeline/local",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 226,
            columnNumber: 21
        }
    }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        icon: __webpack_require__(/*! @tabler/icons/world.svg */ 180),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.all",
            defaultMessage: "All",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 236,
                columnNumber: 29
            }
        }),
        to: "/timeline/local",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 233,
            columnNumber: 21
        }
    }), features.federating && features.bubbleTimeline && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        icon: __webpack_require__(/*! @tabler/icons/hexagon.svg */ 474),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.bubble",
            defaultMessage: "Featured",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 247,
                columnNumber: 29
            }
        }),
        to: "/timeline/bubble",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 244,
            columnNumber: 21
        }
    }), features.federating && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        icon: __webpack_require__(/*! icons/fediverse.svg */ 475),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.fediverse",
            defaultMessage: "Explore",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 258,
                columnNumber: 29
            }
        }),
        to: "/timeline/fediverse",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 255,
            columnNumber: 21
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Divider, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 264,
            columnNumber: 17
        }
    }), account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        to: "/notifications",
        icon: __webpack_require__(/*! @tabler/icons/bell.svg */ 187),
        count: notificationCount,
        onClick: onClose,
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.notifications",
            defaultMessage: "Notifications",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 273,
                columnNumber: 29
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 268,
            columnNumber: 21
        }
    }), features.chats && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        to: "/chats",
        icon: __webpack_require__(/*! @tabler/icons/messages.svg */ 269),
        count: chatsCount,
        onClick: onClose,
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.chats",
            defaultMessage: "Chats",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 283,
                columnNumber: 33
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 278,
            columnNumber: 25
        }
    }), (features.directTimeline || features.conversations) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/messages",
        icon: __webpack_require__(/*! @tabler/icons/mail.svg */ 104),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "column.direct",
            defaultMessage: "Direct messages",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 294,
                columnNumber: 33
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 290,
            columnNumber: 25
        }
    }), features.bookmarks && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/bookmarks",
        icon: __webpack_require__(/*! @tabler/icons/bookmark.svg */ 476),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "column.bookmarks",
            defaultMessage: "Bookmarks",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 305,
                columnNumber: 33
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 301,
            columnNumber: 25
        }
    }), features.lists && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/lists",
        icon: __webpack_require__(/*! @tabler/icons/list.svg */ 411),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "column.lists",
            defaultMessage: "Lists",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 316,
                columnNumber: 33
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 312,
            columnNumber: 25
        }
    }), features.followTags && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/followed_hashtags",
        icon: __webpack_require__(/*! @tabler/icons/hash.svg */ 1132),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "navigation_bar.tags",
            defaultMessage: "Hashtags",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 327,
                columnNumber: 33
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 323,
            columnNumber: 25
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Divider, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 332,
            columnNumber: 21
        }
    }), account.locked && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/follow_requests",
        icon: __webpack_require__(/*! @tabler/icons/user-plus.svg */ 1028),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "navigation_bar.follow_requests",
            defaultMessage: "Follow requests",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 340,
                columnNumber: 33
            }
        }),
        count: followRequestsCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 336,
            columnNumber: 25
        }
    })), features.profileDirectory && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        onClick: onClose,
        to: "/directory",
        icon: __webpack_require__(/*! @tabler/icons/folder.svg */ 1133),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "navigation_bar.profile_directory",
            defaultMessage: "Profile directory",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 354,
                columnNumber: 29
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 350,
            columnNumber: 21
        }
    }), (account === null || account === void 0 ? void 0 : account.staff) && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        to: "/soapbox/admin",
        onClick: onClose,
        icon: __webpack_require__(/*! @tabler/icons/dashboard.svg */ 1134),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.dashboard",
            defaultMessage: "Dashboard",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 365,
                columnNumber: 29
            }
        }),
        count: dashboardCount,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 361,
            columnNumber: 21
        }
    }), account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        to: "/settings",
        onClick: onClose,
        icon: __webpack_require__(/*! @tabler/icons/settings.svg */ 477),
        text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_15__["default"], {
            id: "tabs_bar.settings",
            defaultMessage: "Settings",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 377,
                columnNumber: 29
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 373,
            columnNumber: 21
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Divider, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 383,
            columnNumber: 17
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(SidebarLink, {
        to: "/logout",
        icon: __webpack_require__(/*! @tabler/icons/logout.svg */ 1059),
        text: intl.formatMessage(messages.logout),
        onClick: onClickLogOut,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 385,
            columnNumber: 17
        }
    })))))));
};
/* harmony default export */ __webpack_exports__["default"] = (SidebarMenu);


/***/ }),

/***/ 1662:
/*!******************************************************!*\
  !*** ./app/soapbox/components/status-hover-card.tsx ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StatusHoverCard": function() { return /* binding */ StatusHoverCard; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_popper__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-popper */ 2470);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_status_hover_card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/status-hover-card */ 451);
/* harmony import */ var soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/statuses */ 58);
/* harmony import */ var soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/status_container */ 1029);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _hover_status_wrapper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./hover-status-wrapper */ 1141);
/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ui */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/components/status-hover-card.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }











/** Popup status preview that appears when hovering reply to */
var StatusHoverCard = function (_ref) {
    var _a = _ref.visible, visible = _a === void 0 ? true : _a;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_9__.useHistory)();
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(null), popperElement = _b[0], setPopperElement = _b[1];
    var statusId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.status_hover_card.statusId || undefined; });
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return state.statuses.get(statusId); });
    var targetRef = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$status_hover_c;
        return (_state$status_hover_c = state.status_hover_card.ref) === null || _state$status_hover_c === void 0 ? void 0 : _state$status_hover_c.current;
    });
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        if (statusId && !status) {
            dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_4__.fetchStatus)(statusId));
        }
    }, [statusId, status]);
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        var unlisten = history.listen(function () {
            _hover_status_wrapper__WEBPACK_IMPORTED_MODULE_7__.showStatusHoverCard.cancel();
            dispatch((0,soapbox_actions_status_hover_card__WEBPACK_IMPORTED_MODULE_3__.closeStatusHoverCard)());
        });
        return function () {
            unlisten();
        };
    }, []);
    var _c = (0,react_popper__WEBPACK_IMPORTED_MODULE_10__.usePopper)(targetRef, popperElement, {
        placement: 'top'
    }), styles = _c.styles, attributes = _c.attributes;
    var handleMouseEnter = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function () {
        return function () {
            dispatch((0,soapbox_actions_status_hover_card__WEBPACK_IMPORTED_MODULE_3__.updateStatusHoverCard)());
        };
    }, []);
    var handleMouseLeave = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function () {
        return function () {
            dispatch((0,soapbox_actions_status_hover_card__WEBPACK_IMPORTED_MODULE_3__.closeStatusHoverCard)(true));
        };
    }, []);
    if (!statusId)
        return null;
    var renderStatus = function (statusId) {
        return (
        /*#__PURE__*/
        // @ts-ignore
        react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_containers_status_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: statusId,
            id: statusId,
            hoverable: false,
            hideActionBar: true,
            muted: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 70,
                columnNumber: 7
            }
        }));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", _extends({
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()({
            'absolute transition-opacity w-[500px] z-50 top-0 left-0': true,
            'opacity-100': visible,
            'opacity-0 pointer-events-none': !visible
        }),
        ref: setPopperElement,
        style: styles.popper
    }, attributes.popper, {
        onMouseEnter: handleMouseEnter(),
        onMouseLeave: handleMouseLeave(),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 81,
            columnNumber: 5
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui__WEBPACK_IMPORTED_MODULE_8__.Card, {
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_ui__WEBPACK_IMPORTED_MODULE_8__.CardBody, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 9
        }
    }, renderStatus(statusId))));
};
/* harmony default export */ __webpack_exports__["default"] = (StatusHoverCard);


/***/ }),

/***/ 1800:
/*!****************************************************!*\
  !*** ./app/soapbox/features/birthdays/account.tsx ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/avatar */ 403);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/display-name */ 404);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/icon */ 28);
/* harmony import */ var soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/permalink */ 1033);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/birthdays/account.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__.defineMessages)({
    birthday: {
        "id": "account.birthday",
        "defaultMessage": "Born {date}"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__.makeGetAccount)();
var Account = function (_ref) {
    var accountId = _ref.accountId;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__["default"])();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return getAccount(state, accountId); }); // useEffect(() => {
    //   if (accountId && !account) {
    //     fetchAccount(accountId);
    //   }
    // }, [accountId]);
    if (!account)
        return null;
    var birthday = account.get('birthday');
    if (!birthday)
        return null;
    var formattedBirthday = intl.formatDate(birthday, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_permalink__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "account__display-name",
        title: account.get('acct'),
        href: "/@".concat(account.get('acct')),
        to: "/@".concat(account.get('acct')),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_1__["default"], {
        account: account,
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 54
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_2__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 13
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex items-center gap-0.5",
        title: intl.formatMessage(messages.birthday, {
            date: formattedBirthday
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: __webpack_require__(/*! @tabler/icons/ballon.svg */ 1425),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 11
        }
    }), formattedBirthday)));
};
/* harmony default export */ __webpack_exports__["default"] = (Account);


/***/ }),

/***/ 1797:
/*!*********************************************************!*\
  !*** ./app/soapbox/features/reply_mentions/account.tsx ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/accounts */ 18);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/compose */ 30);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/avatar */ 403);
/* harmony import */ var soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/display-name */ 404);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/components/icon_button */ 401);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/reply_mentions/account.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    remove: {
        "id": "reply_mentions.account.remove",
        "defaultMessage": "Remove from mentions"
    },
    add: {
        "id": "reply_mentions.account.add",
        "defaultMessage": "Add to mentions"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_8__.makeGetAccount)();
var Account = function (_ref) {
    var accountId = _ref.accountId, author = _ref.author;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    var added = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) {
        var _state$compose$to;
        return !!account && ((_state$compose$to = state.compose.to) === null || _state$compose$to === void 0 ? void 0 : _state$compose$to.includes(account.acct));
    });
    var onRemove = function () { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_3__.removeFromMentions)(accountId)); };
    var onAdd = function () { return dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_3__.addToMentions)(accountId)); };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        if (accountId && !account) {
            dispatch((0,soapbox_actions_accounts__WEBPACK_IMPORTED_MODULE_2__.fetchAccount)(accountId));
        }
    }, []);
    if (!account)
        return null;
    var button;
    if (added) {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
            src: __webpack_require__(/*! @tabler/icons/x.svg */ 56),
            title: intl.formatMessage(messages.remove),
            onClick: onRemove,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 45,
                columnNumber: 14
            }
        });
    }
    else {
        button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_6__["default"], {
            src: __webpack_require__(/*! @tabler/icons/plus.svg */ 248),
            title: intl.formatMessage(messages.add),
            onClick: onAdd,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 14
            }
        });
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__display-name",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__avatar-wrapper",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_4__["default"], {
        account: account,
        size: 36,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 52
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_display_name__WEBPACK_IMPORTED_MODULE_5__["default"], {
        account: account,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "account__relationship",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 9
        }
    }, !author && button)));
};
/* harmony default export */ __webpack_exports__["default"] = (Account);


/***/ }),

/***/ 1620:
/*!*******************************************************************!*\
  !*** ./app/soapbox/features/ui/components/account_note_modal.tsx ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_account_notes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/account-notes */ 441);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/account_note_modal.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    placeholder: {
        "id": "account_note.placeholder",
        "defaultMessage": "No comment provided"
    },
    save: {
        "id": "account_note.save",
        "defaultMessage": "Save"
    }
});
var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_5__.makeGetAccount)();
var AccountNoteModal = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var isSubmitting = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.account_notes.edit.isSubmitting; });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return getAccount(state, state.account_notes.edit.account); });
    var comment = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.account_notes.edit.comment; });
    var onClose = function () {
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.closeModal)('ACCOUNT_NOTE'));
    };
    var handleCommentChange = function (e) {
        dispatch((0,soapbox_actions_account_notes__WEBPACK_IMPORTED_MODULE_1__.changeAccountNoteComment)(e.target.value));
    };
    var handleSubmit = function () {
        dispatch((0,soapbox_actions_account_notes__WEBPACK_IMPORTED_MODULE_1__.submitAccountNote)());
    };
    var handleKeyDown = function (e) {
        if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "account_note.target",
            defaultMessage: "Note for @{target}",
            values: {
                target: account.acct
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 45,
                columnNumber: 14
            }
        }),
        onClose: onClose,
        confirmationAction: handleSubmit,
        confirmationText: intl.formatMessage(messages.save),
        confirmationDisabled: isSubmitting,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 44,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Text, {
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
        id: "account_note.hint",
        defaultMessage: "You can keep notes about this user for yourself (this will not be shared with them):",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 9
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("textarea", {
        className: "setting-text light",
        placeholder: intl.formatMessage(messages.placeholder),
        value: comment,
        onChange: handleCommentChange,
        onKeyDown: handleKeyDown,
        disabled: isSubmitting,
        autoFocus: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (AccountNoteModal);


/***/ }),

/***/ 1604:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/actions_modal.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/icon */ 28);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/actions_modal.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }




var ActionsModal = function (_ref) {
    var status = _ref.status, actions = _ref.actions, onClick = _ref.onClick, onClose = _ref.onClose;
    var renderAction = function (action, i) {
        if (action === null) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
                key: "sep-".concat(i),
                className: "dropdown-menu__separator",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 20,
                    columnNumber: 14
                }
            });
        }
        var _a = action.icon, icon = _a === void 0 ? null : _a, text = action.text, _b = action.meta, meta = _b === void 0 ? null : _b, _c = action.active, active = _c === void 0 ? false : _c, _d = action.href, href = _d === void 0 ? '#' : _d, isLogout = action.isLogout, destructive = action.destructive;
        var Comp = href === '#' ? 'button' : 'a';
        var compProps = href === '#' ? {
            onClick: onClick
        } : {
            href: href
        };
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
            key: "".concat(text, "-").concat(i),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(Comp, _extends({}, compProps, {
            rel: "noopener",
            "data-index": i,
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
                active: active,
                destructive: destructive
            }, 'w-full'),
            "data-method": isLogout ? 'delete' : null,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 9
            }
        }), icon && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
            title: text,
            src: icon,
            role: "presentation",
            tabIndex: -1,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 37,
                columnNumber: 20
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 38,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_0___default()({
                'actions-modal__item-label': !!meta
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 39,
                columnNumber: 13
            }
        }, text), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 40,
                columnNumber: 13
            }
        }, meta))));
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "modal-root__modal actions-modal rounded-t-lg relative overflow-hidden w-full max-h-full mt-auto max-auto bg-white dark:bg-slate-800",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 48,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("ul", {
        className: classnames__WEBPACK_IMPORTED_MODULE_0___default()('w-full', {
            'with-status': !!status
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 7
        }
    }, actions && actions.map(renderAction), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
        className: "dropdown-menu__separator",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("li", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", {
        type: "button",
        onClick: onClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "lightbox.close",
        defaultMessage: "Cancel",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 13
        }
    })))));
};
/* harmony default export */ __webpack_exports__["default"] = (ActionsModal);


/***/ }),

/***/ 1618:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/ui/components/birthdays_modal.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1020);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_birthdays_account__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/birthdays/account */ 1800);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/birthdays_modal.tsx";






var BirthdaysModal = function (_ref) {
    var onClose = _ref.onClose;
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) {
        var _state$user_lists$bir;
        return (_state$user_lists$bir = state.user_lists.birthday_reminders.get(state.me)) === null || _state$user_lists$bir === void 0 ? void 0 : _state$user_lists$bir.items;
    });
    var onClickClose = function () {
        onClose('BIRTHDAYS');
    };
    var body;
    if (!accountIds) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 23,
                columnNumber: 12
            }
        });
    }
    else {
        var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
            id: "birthdays_modal.empty",
            defaultMessage: "None of your friends have birthday today.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 25,
                columnNumber: 26
            }
        });
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_1__["default"], {
            scrollKey: "birthdays",
            emptyMessage: emptyMessage,
            itemClassName: "pb-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 28,
                columnNumber: 7
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_birthdays_account__WEBPACK_IMPORTED_MODULE_3__["default"], {
            key: id,
            accountId: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 34,
                columnNumber: 11
            }
        }); }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_5__["default"], {
            id: "column.birthdays",
            defaultMessage: "Birthdays",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 42,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (BirthdaysModal);


/***/ }),

/***/ 1601:
/*!************************************************************!*\
  !*** ./app/soapbox/features/ui/components/boost_modal.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/icon */ 28);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_compose_components_reply_indicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/compose/components/reply_indicator */ 1148);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/boost_modal.tsx";





var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_4__.defineMessages)({
    cancel_reblog: {
        "id": "status.cancel_reblog_private",
        "defaultMessage": "Un-repost"
    },
    reblog: {
        "id": "status.reblog",
        "defaultMessage": "Repost"
    }
});
var BoostModal = function (_ref) {
    var status = _ref.status, onReblog = _ref.onReblog, onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var handleReblog = function () {
        onReblog(status);
        onClose();
    };
    var buttonText = status.reblogged ? messages.cancel_reblog : messages.reblog;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
        title: "Repost?",
        confirmationAction: handleReblog,
        confirmationText: intl.formatMessage(buttonText),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_compose_components_reply_indicator__WEBPACK_IMPORTED_MODULE_3__["default"], {
        status: status,
        hideActions: true,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
        id: "boost_modal.combo",
        defaultMessage: "You can press {combo} to skip this next time",
        values: {
            combo: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 41,
                    columnNumber: 131
                }
            }, "Shift + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_1__["default"], {
                className: "inline-block align-middle",
                src: __webpack_require__(/*! @tabler/icons/repeat.svg */ 253),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 41,
                    columnNumber: 145
                }
            }))
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (BoostModal);


/***/ }),

/***/ 1846:
/*!*******************************************************************!*\
  !*** ./app/soapbox/features/ui/components/bundle_modal_error.tsx ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/icon_button */ 401);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/bundle_modal_error.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    error: {
        "id": "bundle_modal_error.message",
        "defaultMessage": "Something went wrong while loading this page."
    },
    retry: {
        "id": "bundle_modal_error.retry",
        "defaultMessage": "Try again"
    },
    close: {
        "id": "bundle_modal_error.close",
        "defaultMessage": "Close"
    }
});
var BundleModalError = function (_ref) {
    var onRetry = _ref.onRetry, onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_3__["default"])();
    var handleRetry = function () {
        onRetry();
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "modal-root__modal error-modal",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 25,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "error-modal__body",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 26,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_1__["default"], {
        title: intl.formatMessage(messages.retry),
        icon: "refresh",
        onClick: handleRetry,
        size: 64,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 9
        }
    }), intl.formatMessage(messages.error)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "error-modal__footer",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 31,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 32,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
        onClick: onClose,
        className: "error-modal__nav onboarding-modal__skip",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 11
        }
    }, intl.formatMessage(messages.close)))));
};
/* harmony default export */ __webpack_exports__["default"] = (BundleModalError);


/***/ }),

/***/ 1612:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/ui/components/component_modal.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/component_modal.tsx";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }


var ComponentModal = function (_ref) {
    var onClose = _ref.onClose, Component = _ref.component, _a = _ref.componentProps, componentProps = _a === void 0 ? {} : _a;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        onClose: onClose,
        title: "",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 14,
            columnNumber: 3
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Component, _extends({
        onClose: onClose
    }, componentProps, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 5
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (ComponentModal);


/***/ }),

/***/ 1607:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/compose_modal.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 30);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var _compose_containers_compose_form_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../compose/containers/compose_form_container */ 1423);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/compose_modal.tsx";







var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    confirm: {
        "id": "confirmations.delete.confirm",
        "defaultMessage": "Delete"
    },
    cancelEditing: {
        "id": "confirmations.cancel_editing.confirm",
        "defaultMessage": "Cancel editing"
    }
});
var ComposeModal = function (_ref) {
    var onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppDispatch)();
    var statusId = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.compose.id; });
    var composeText = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.compose.text; });
    var privacy = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.compose.privacy; });
    var inReplyTo = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.compose.in_reply_to; });
    var quote = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_4__.useAppSelector)(function (state) { return state.compose.quote; });
    var onClickClose = function () {
        if (composeText) {
            dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.openModal)('CONFIRM', {
                icon: __webpack_require__(/*! @tabler/icons/trash.svg */ 252),
                heading: statusId ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "confirmations.cancel_editing.heading",
                    defaultMessage: "Cancel post editing",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 36,
                        columnNumber: 13
                    }
                }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "confirmations.delete.heading",
                    defaultMessage: "Delete post",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 37,
                        columnNumber: 13
                    }
                }),
                message: statusId ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "confirmations.cancel_editing.message",
                    defaultMessage: "Are you sure you want to cancel editing this post? All changes will be lost.",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 39,
                        columnNumber: 13
                    }
                }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                    id: "confirmations.delete.message",
                    defaultMessage: "Are you sure you want to delete this post?",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 40,
                        columnNumber: 13
                    }
                }),
                confirm: intl.formatMessage(statusId ? messages.cancelEditing : messages.confirm),
                onConfirm: function () {
                    dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.closeModal)('COMPOSE'));
                    dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.cancelReplyCompose)());
                }
            }));
        }
        else {
            onClose('COMPOSE');
        }
    };
    var renderTitle = function () {
        if (statusId) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                id: "navigation_bar.compose_edit",
                defaultMessage: "Edit post",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 54,
                    columnNumber: 14
                }
            });
        }
        else if (privacy === 'direct') {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                id: "navigation_bar.compose_direct",
                defaultMessage: "Direct message",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 56,
                    columnNumber: 14
                }
            });
        }
        else if (inReplyTo) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                id: "navigation_bar.compose_reply",
                defaultMessage: "Reply to post",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58,
                    columnNumber: 14
                }
            });
        }
        else if (quote) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                id: "navigation_bar.compose_quote",
                defaultMessage: "Quote post",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 60,
                    columnNumber: 14
                }
            });
        }
        else {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
                id: "navigation_bar.compose",
                defaultMessage: "Compose new post",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 62,
                    columnNumber: 14
                }
            });
        }
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: renderTitle(),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_compose_containers_compose_form_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (ComposeModal);


/***/ }),

/***/ 1602:
/*!*******************************************************************!*\
  !*** ./app/soapbox/features/ui/components/confirmation_modal.tsx ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/features/forms */ 1022);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/confirmation_modal.tsx";





var ConfirmationModal = function (_ref) {
    var heading = _ref.heading, message = _ref.message, confirm = _ref.confirm, onClose = _ref.onClose, onConfirm = _ref.onConfirm, secondary = _ref.secondary, onSecondary = _ref.onSecondary, onCancel = _ref.onCancel, checkbox = _ref.checkbox;
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false), checked = _a[0], setChecked = _a[1];
    var handleClick = function () {
        onClose('CONFIRM');
        onConfirm();
    };
    var handleSecondary = function () {
        onClose('CONFIRM');
        onSecondary();
    };
    var handleCancel = function () {
        onClose('CONFIRM');
        if (onCancel)
            onCancel();
    };
    var handleCheckboxChange = function (e) {
        setChecked(e.target.checked);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
        title: heading,
        confirmationAction: handleClick,
        confirmationText: confirm,
        confirmationDisabled: checkbox && !checked,
        confirmationTheme: "danger",
        cancelText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
            id: "confirmation_modal.cancel",
            defaultMessage: "Cancel",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 58,
                columnNumber: 19
            }
        }),
        cancelAction: handleCancel,
        secondaryText: secondary,
        secondaryAction: onSecondary && handleSecondary,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 52,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("p", {
        className: "text-gray-600 dark:text-gray-300",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 7
        }
    }, message), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mt-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 7
        }
    }, checkbox && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "confirmation-modal__checkbox",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 22
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.SimpleForm, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.FieldsGroup, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_3__.Checkbox, {
        onChange: handleCheckboxChange,
        label: checkbox,
        checked: checked,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 15
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (ConfirmationModal);


/***/ }),

/***/ 1646:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/ui/components/cta-banner.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/cta-banner.tsx";




var CtaBanner = function () {
    var singleUserMode = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSoapboxConfig)().singleUserMode;
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.title; });
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.me; });
    if (me || singleUserMode)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        "data-testid": "cta-banner",
        className: "hidden lg:block",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 15,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Banner, {
        theme: "frosted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        alignItems: "center",
        justifyContent: "between",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "white",
        size: "xl",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "signup_panel.title",
        defaultMessage: "New to {site_title}?",
        values: {
            site_title: siteTitle
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "white",
        weight: "medium",
        className: "opacity-90",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "signup_panel.subtitle",
        defaultMessage: "Sign up now to discuss what's happening.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 24,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        theme: "secondary",
        to: "/login",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "account.login",
        defaultMessage: "Log in",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 30,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        theme: "accent",
        to: "/signup",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "account.register",
        defaultMessage: "Sign up",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 15
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (CtaBanner);


/***/ }),

/***/ 1610:
/*!**********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/edit_federation_modal.tsx ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_toggle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-toggle */ 1026);
/* harmony import */ var soapbox_actions_mrf__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/mrf */ 1798);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/snackbar */ 23);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_features_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/features/forms */ 1022);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/edit_federation_modal.tsx";











var getRemoteInstance = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_8__.makeGetRemoteInstance)();
var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__.defineMessages)({
    mediaRemoval: {
        "id": "edit_federation.media_removal",
        "defaultMessage": "Strip media"
    },
    forceNsfw: {
        "id": "edit_federation.force_nsfw",
        "defaultMessage": "Force attachments to be marked sensitive"
    },
    unlisted: {
        "id": "edit_federation.unlisted",
        "defaultMessage": "Force posts unlisted"
    },
    followersOnly: {
        "id": "edit_federation.followers_only",
        "defaultMessage": "Hide posts except to followers"
    },
    save: {
        "id": "edit_federation.save",
        "defaultMessage": "Save"
    },
    success: {
        "id": "edit_federation.success",
        "defaultMessage": "{host} federation was updated"
    }
});
/** Modal for moderators to edit federation with a remote instance. */
var EditFederationModal = function (_ref) {
    var host = _ref.host, onClose = _ref.onClose;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_10__["default"])();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppDispatch)();
    var remoteInstance = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_7__.useAppSelector)(function (state) { return getRemoteInstance(state, host); });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)((0,immutable__WEBPACK_IMPORTED_MODULE_11__.Map)()), data = _a[0], setData = _a[1];
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        setData(remoteInstance.get('federation'));
    }, [remoteInstance]);
    var handleDataChange = function (key) {
        return function (_ref2) {
            var target = _ref2.target;
            setData(data.set(key, target.checked));
        };
    };
    var handleMediaRemoval = function (_ref3) {
        var checked = _ref3.target.checked;
        var newData = data.merge({
            avatar_removal: checked,
            banner_removal: checked,
            media_removal: checked
        });
        setData(newData);
    };
    var handleSubmit = function () {
        dispatch((0,soapbox_actions_mrf__WEBPACK_IMPORTED_MODULE_3__.updateMrf)(host, data)).then(function () { return dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_4__["default"].success(intl.formatMessage(messages.success, {
            host: host
        }))); }).catch(function () { });
        onClose();
    };
    var _b = data.toJS(), avatar_removal = _b.avatar_removal, banner_removal = _b.banner_removal, federated_timeline_removal = _b.federated_timeline_removal, followers_only = _b.followers_only, media_nsfw = _b.media_nsfw, media_removal = _b.media_removal, reject = _b.reject;
    var fullMediaRemoval = avatar_removal && banner_removal && media_removal;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Modal, {
        onClose: onClose,
        title: host,
        confirmationAction: handleSubmit,
        confirmationText: intl.formatMessage(messages.save),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_features_forms__WEBPACK_IMPORTED_MODULE_6__.SimpleForm, {
        onSubmit: handleSubmit,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        checked: reject,
        onChange: handleDataChange('reject'),
        icons: false,
        id: "reject",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 88,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "reject",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "edit_federation.reject",
        defaultMessage: "Reject all activities",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 99,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        checked: fullMediaRemoval,
        onChange: handleMediaRemoval,
        icons: false,
        id: "media_removal",
        disabled: reject,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "media_removal",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 108,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "edit_federation.media_removal",
        defaultMessage: "Strip media",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 112,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        checked: media_nsfw,
        onChange: handleDataChange('media_nsfw'),
        icons: false,
        id: "media_nsfw",
        disabled: reject || media_removal,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "media_nsfw",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "edit_federation.force_nsfw",
        defaultMessage: "Force attachments to be marked sensitive",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 125,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        checked: followers_only,
        onChange: handleDataChange('followers_only'),
        icons: false,
        id: "followers_only",
        disabled: reject,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "followers_only",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "edit_federation.followers_only",
        defaultMessage: "Hide posts except to followers",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 15
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.HStack, {
        space: 2,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_toggle__WEBPACK_IMPORTED_MODULE_2__["default"], {
        checked: federated_timeline_removal,
        onChange: handleDataChange('federated_timeline_removal'),
        icons: false,
        id: "federated_timeline_removal",
        disabled: reject || followers_only,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 139,
            columnNumber: 13
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_5__.Text, {
        theme: "muted",
        tag: "label",
        size: "sm",
        htmlFor: "federated_timeline_removal",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "edit_federation.unlisted",
        defaultMessage: "Force posts unlisted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 148,
            columnNumber: 15
        }
    }))))));
};
/* harmony default export */ __webpack_exports__["default"] = (EditFederationModal);


/***/ }),

/***/ 1614:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/ui/components/favourites_modal.tsx ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/interactions */ 103);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1020);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/containers/account_container */ 120);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/favourites_modal.tsx";







var FavouritesModal = function (_ref) {
    var onClose = _ref.onClose, statusId = _ref.statusId;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) {
        var _state$user_lists$fav;
        return (_state$user_lists$fav = state.user_lists.favourited_by.get(statusId)) === null || _state$user_lists$fav === void 0 ? void 0 : _state$user_lists$fav.items;
    });
    var fetchData = function () {
        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_1__.fetchFavourites)(statusId));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        fetchData();
    }, []);
    var onClickClose = function () {
        onClose('FAVOURITES');
    };
    var body;
    if (!accountIds) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 35,
                columnNumber: 12
            }
        });
    }
    else {
        var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
            id: "empty_column.favourites",
            defaultMessage: "No one has liked this post yet. When someone does, they will show up here.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 37,
                columnNumber: 26
            }
        });
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_2__["default"], {
            scrollKey: "favourites",
            emptyMessage: emptyMessage,
            itemClassName: "pb-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 40,
                columnNumber: 7
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
            key: id,
            id: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 46,
                columnNumber: 11
            }
        }); }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
            id: "column.favourites",
            defaultMessage: "Likes",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 54,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (FavouritesModal);


/***/ }),

/***/ 1605:
/*!*****************************************************************!*\
  !*** ./app/soapbox/features/ui/components/focal_point_modal.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FocalPointModal; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-immutable-proptypes */ 172);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-pure-component */ 121);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var _actions_compose__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../actions/compose */ 30);
/* harmony import */ var _video__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../video */ 419);
/* harmony import */ var _image_loader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./image_loader */ 1743);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _dec, _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/focal_point_modal.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }








var mapStateToProps = function (state, _ref) {
    var id = _ref.id;
    return {
        media: state.getIn(['compose', 'media_attachments']).find(function (item) { return item.get('id') === id; })
    };
};
var mapDispatchToProps = function (dispatch, _ref2) {
    var id = _ref2.id;
    return {
        onSave: function (x, y) {
            dispatch((0,_actions_compose__WEBPACK_IMPORTED_MODULE_6__.changeUploadCompose)(id, {
                focus: "".concat(x.toFixed(2), ",").concat(y.toFixed(2))
            }));
        }
    };
};
var FocalPointModal = (_dec = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.connect)(mapStateToProps, mapDispatchToProps), _dec(_class = (_class2 = /** @class */ (function (_super) {
    __extends(FocalPointModal, _super);
    function FocalPointModal() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            x: 0,
            y: 0,
            focusX: 0,
            focusY: 0,
            dragging: false
        });
        _defineProperty(_this, "handleMouseDown", function (e) {
            document.addEventListener('mousemove', _this.handleMouseMove);
            document.addEventListener('mouseup', _this.handleMouseUp);
            _this.updatePosition(e);
            _this.setState({
                dragging: true
            });
        });
        _defineProperty(_this, "handleMouseMove", function (e) {
            _this.updatePosition(e);
        });
        _defineProperty(_this, "handleMouseUp", function () {
            document.removeEventListener('mousemove', _this.handleMouseMove);
            document.removeEventListener('mouseup', _this.handleMouseUp);
            _this.setState({
                dragging: false
            });
            _this.props.onSave(_this.state.focusX, _this.state.focusY);
        });
        _defineProperty(_this, "updatePosition", function (e) {
            var _a = (0,_video__WEBPACK_IMPORTED_MODULE_7__.getPointerPosition)(_this.node, e), x = _a.x, y = _a.y;
            var focusX = (x - .5) * 2;
            var focusY = (y - .5) * -2;
            _this.setState({
                x: x,
                y: y,
                focusX: focusX,
                focusY: focusY
            });
        });
        _defineProperty(_this, "updatePositionFromMedia", function (media) {
            var focusX = media.getIn(['meta', 'focus', 'x']);
            var focusY = media.getIn(['meta', 'focus', 'y']);
            if (focusX && focusY) {
                var x = focusX / 2 + .5;
                var y = focusY / -2 + .5;
                _this.setState({
                    x: x,
                    y: y,
                    focusX: focusX,
                    focusY: focusY
                });
            }
            else {
                _this.setState({
                    x: 0.5,
                    y: 0.5,
                    focusX: 0,
                    focusY: 0
                });
            }
        });
        _defineProperty(_this, "setRef", function (c) {
            _this.node = c;
        });
        return _this;
    }
    FocalPointModal.prototype.componentDidMount = function () {
        this.updatePositionFromMedia(this.props.media);
    };
    FocalPointModal.prototype.componentDidUpdate = function (prevProps) {
        var media = this.props.media;
        if (prevProps.media.get('id') !== media.get('id')) {
            this.updatePositionFromMedia(media);
        }
    };
    FocalPointModal.prototype.componentWillUnmount = function () {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    };
    FocalPointModal.prototype.render = function () {
        var media = this.props.media;
        var _a = this.state, x = _a.x, y = _a.y, dragging = _a.dragging;
        var width = media.getIn(['meta', 'original', 'width']) || null;
        var height = media.getIn(['meta', 'original', 'height']) || null;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "modal-root__modal video-modal focal-point-modal",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 109,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('focal-point', {
                dragging: dragging
            }),
            ref: this.setRef,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 110,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(_image_loader__WEBPACK_IMPORTED_MODULE_8__["default"], {
            previewSrc: media.get('preview_url'),
            src: media.get('url'),
            width: width,
            height: height,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 111,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "focal-point__reticle",
            style: {
                top: "".concat(y * 100, "%"),
                left: "".concat(x * 100, "%")
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 118,
                columnNumber: 11
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "focal-point__overlay",
            onMouseDown: this.handleMouseDown,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 119,
                columnNumber: 11
            }
        })));
    };
    return FocalPointModal;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_4__["default"])), _defineProperty(_class2, "propTypes", {
    media: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_3___default().map.isRequired)
}), _class2)) || _class);



/***/ }),

/***/ 1647:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/funding_panel.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_patron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/patron */ 1051);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/funding_panel.tsx";





/** Open link in a new tab. */
// https://stackoverflow.com/a/28374344/8811886
var openInNewTab = function (href) {
    Object.assign(document.createElement('a'), {
        target: '_blank',
        href: href
    }).click();
};
/** Formats integer to USD string. */
var moneyFormat = function (amount) { return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'usd',
    notation: 'compact'
}).format(amount / 100); };
var FundingPanel = function () {
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var patron = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.patron.instance; });
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        dispatch((0,soapbox_actions_patron__WEBPACK_IMPORTED_MODULE_1__.fetchPatronInstance)());
    }, []);
    if (patron.funding.isEmpty() || patron.goals.isEmpty())
        return null;
    var amount = patron.getIn(['funding', 'amount']);
    var goal = patron.getIn(['goals', '0', 'amount']);
    var goalText = patron.getIn(['goals', '0', 'text']);
    var goalReached = amount >= goal;
    var ratioText;
    if (goalReached) {
        ratioText = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 45,
                columnNumber: 19
            }
        }, moneyFormat(goal)), " per month", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
            className: "funding-panel__reached",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 45,
                columnNumber: 65
            }
        }, "\u2014 reached!"));
    }
    else {
        ratioText = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 19
            }
        }, moneyFormat(amount), " out of ", moneyFormat(goal)), " per month");
    }
    var handleDonateClick = function () {
        openInNewTab(patron.url);
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Widget, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
            id: "patron.title",
            defaultMessage: "Funding Goal",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 56,
                columnNumber: 14
            }
        }),
        onActionClick: handleDonateClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "funding-panel__ratio",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 9
        }
    }, ratioText)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.ProgressBar, {
        progress: amount / goal,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 7
        }
    }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "funding-panel__description",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 9
        }
    }, goalText)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 66,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
        theme: "ghost",
        onClick: handleDonateClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "patron.donate",
        defaultMessage: "Donate",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (FundingPanel);


/***/ }),

/***/ 1606:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/hotkeys_modal.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_features__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/utils/features */ 19);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/hotkeys_modal.tsx";





var Hotkey = function (_ref) {
    var children = _ref.children;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("kbd", {
        className: "px-1.5 py-1 bg-primary-50 dark:bg-slate-700 border border-solid border-primary-200 rounded-md dark:border-slate-500 text-xs font-sans",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 13,
            columnNumber: 3
        }
    }, children);
};
var TableCell = function (_ref2) {
    var children = _ref2.children;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("td", {
        className: "pb-3 px-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 3
        }
    }, children);
};
var HotkeysModal = function (_ref3) {
    var onClose = _ref3.onClose;
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return (0,soapbox_utils_features__WEBPACK_IMPORTED_MODULE_3__.getFeatures)(state.instance); });
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
            id: "keyboard_shortcuts.heading",
            defaultMessage: "Keyboard shortcuts",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 29,
                columnNumber: 14
            }
        }),
        onClose: onClose,
        width: "4xl",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "flex flex-col lg:flex-row text-xs",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 33,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("table", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("thead", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("th", {
        className: "pb-2 font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.hotkey",
        defaultMessage: "Hotkey",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 46
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tbody", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 40,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 42,
            columnNumber: 26
        }
    }, "r")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.reply",
        defaultMessage: "to reply",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 43,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 45,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 46,
            columnNumber: 26
        }
    }, "m")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.mention",
        defaultMessage: "to mention author",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 47,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 26
        }
    }, "p")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.profile",
        defaultMessage: "to open author's profile",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 51,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 53,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 26
        }
    }, "f")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.favourite",
        defaultMessage: "to like",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 26
        }
    }))), features.emojiReacts && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 58,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 59,
            columnNumber: 28
        }
    }, "e")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.react",
        defaultMessage: "to react",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 60,
            columnNumber: 28
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 63,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 64,
            columnNumber: 26
        }
    }, "b")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.boost",
        defaultMessage: "to repost",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 65,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 26
        }
    }, "enter"), ", ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 50
        }
    }, "o")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.enter",
        defaultMessage: "to open post",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 71,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 26
        }
    }, "a")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.open_media",
        defaultMessage: "to open media",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 26
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("table", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 77,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("thead", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 78,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 79,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("th", {
        className: "pb-2 font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.hotkey",
        defaultMessage: "Hotkey",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 80,
            columnNumber: 46
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tbody", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 83,
            columnNumber: 11
        }
    }, features.spoilers && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 85,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 86,
            columnNumber: 28
        }
    }, "x")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.toggle_hidden",
        defaultMessage: "to show/hide text behind CW",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 28
        }
    }))), features.spoilers && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 92,
            columnNumber: 28
        }
    }, "h")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.toggle_sensitivity",
        defaultMessage: "to show/hide media",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 93,
            columnNumber: 28
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 96,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 26
        }
    }, "up"), ", ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 97,
            columnNumber: 47
        }
    }, "k")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.up",
        defaultMessage: "to move up in the list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 98,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 100,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 26
        }
    }, "down"), ", ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 101,
            columnNumber: 49
        }
    }, "j")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.down",
        defaultMessage: "to move down in the list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 105,
            columnNumber: 26
        }
    }, "n")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 106,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.compose",
        defaultMessage: "to focus the compose textarea",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 106,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 108,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 26
        }
    }, "alt"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 109,
            columnNumber: 49
        }
    }, "n")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.toot",
        defaultMessage: "to start a new post",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 110,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 112,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 113,
            columnNumber: 26
        }
    }, "backspace")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.back",
        defaultMessage: "to navigate back",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 114,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 116,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 117,
            columnNumber: 26
        }
    }, "s")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.search",
        defaultMessage: "to focus search",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 118,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 120,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 121,
            columnNumber: 26
        }
    }, "esc")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.unfocus",
        defaultMessage: "to un-focus compose textarea/search",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 122,
            columnNumber: 26
        }
    }))))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("table", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 126,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("thead", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 127,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 128,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("th", {
        className: "pb-2 font-bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.hotkey",
        defaultMessage: "Hotkey",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 129,
            columnNumber: 46
        }
    })))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tbody", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 132,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 133,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 134,
            columnNumber: 47
        }
    }, "h")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.home",
        defaultMessage: "to open home timeline",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 135,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 137,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 138,
            columnNumber: 47
        }
    }, "n")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 139,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.notifications",
        defaultMessage: "to open notifications column",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 139,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 141,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 142,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 142,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 142,
            columnNumber: 47
        }
    }, "f")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 143,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.favourites",
        defaultMessage: "to open likes list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 143,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 145,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 47
        }
    }, "p")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.pinned",
        defaultMessage: "to open pinned posts list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 149,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 150,
            columnNumber: 47
        }
    }, "u")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 151,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.my_profile",
        defaultMessage: "to open your profile",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 151,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 153,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 154,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 154,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 154,
            columnNumber: 47
        }
    }, "b")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 155,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.blocked",
        defaultMessage: "to open blocked users list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 155,
            columnNumber: 26
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 157,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 26
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 158,
            columnNumber: 47
        }
    }, "m")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 159,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.muted",
        defaultMessage: "to open muted users list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 159,
            columnNumber: 26
        }
    }))), features.followRequests && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 162,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 163,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 163,
            columnNumber: 28
        }
    }, "g"), " + ", /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 163,
            columnNumber: 49
        }
    }, "r")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 164,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.requests",
        defaultMessage: "to open follow requests list",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 164,
            columnNumber: 28
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("tr", {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 167,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 168,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(Hotkey, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 168,
            columnNumber: 26
        }
    }, "?")), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(TableCell, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 169,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_4__["default"], {
        id: "keyboard_shortcuts.legend",
        defaultMessage: "to display this legend",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 169,
            columnNumber: 26
        }
    })))))));
};
/* harmony default export */ __webpack_exports__["default"] = (HotkeysModal);


/***/ }),

/***/ 1743:
/*!************************************************************!*\
  !*** ./app/soapbox/features/ui/components/image_loader.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _zoomable_image__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./zoomable_image */ 1796);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/image_loader.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }




var ImageLoader = /** @class */ (function (_super) {
    __extends(ImageLoader, _super);
    function ImageLoader() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            loading: true,
            error: false,
            width: null
        });
        _defineProperty(_this, "removers", []);
        _defineProperty(_this, "canvas", null);
        _defineProperty(_this, "loadPreviewCanvas", function (_ref) {
            var previewSrc = _ref.previewSrc, width = _ref.width, height = _ref.height;
            return new Promise(function (resolve, reject) {
                var image = new Image();
                var removeEventListeners = function () {
                    image.removeEventListener('error', handleError);
                    image.removeEventListener('load', handleLoad);
                };
                var handleError = function () {
                    removeEventListeners();
                    reject();
                };
                var handleLoad = function () {
                    removeEventListeners();
                    _this.canvasContext.drawImage(image, 0, 0, width, height);
                    resolve();
                };
                image.addEventListener('error', handleError);
                image.addEventListener('load', handleLoad);
                image.src = previewSrc;
                _this.removers.push(removeEventListeners);
            });
        });
        _defineProperty(_this, "loadOriginalImage", function (_ref2) {
            var src = _ref2.src;
            return new Promise(function (resolve, reject) {
                var image = new Image();
                var removeEventListeners = function () {
                    image.removeEventListener('error', handleError);
                    image.removeEventListener('load', handleLoad);
                };
                var handleError = function () {
                    removeEventListeners();
                    reject();
                };
                var handleLoad = function () {
                    removeEventListeners();
                    resolve();
                };
                image.addEventListener('error', handleError);
                image.addEventListener('load', handleLoad);
                image.src = src;
                _this.removers.push(removeEventListeners);
            });
        });
        _defineProperty(_this, "setCanvasRef", function (c) {
            _this.canvas = c;
            if (c)
                _this.setState({
                    width: c.offsetWidth
                });
        });
        return _this;
    }
    Object.defineProperty(ImageLoader.prototype, "canvasContext", {
        get: function () {
            if (!this.canvas) {
                return null;
            }
            this._canvasContext = this._canvasContext || this.canvas.getContext('2d');
            return this._canvasContext;
        },
        enumerable: false,
        configurable: true
    });
    ImageLoader.prototype.componentDidMount = function () {
        this.loadImage(this.props);
    };
    ImageLoader.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.src !== this.props.src) {
            this.loadImage(this.props);
        }
    };
    ImageLoader.prototype.componentWillUnmount = function () {
        this.removeEventListeners();
    };
    ImageLoader.prototype.loadImage = function (props) {
        var _this = this;
        this.removeEventListeners();
        this.setState({
            loading: true,
            error: false
        });
        Promise.all([props.previewSrc && this.loadPreviewCanvas(props), this.hasSize() && this.loadOriginalImage(props)].filter(Boolean)).then(function () {
            _this.setState({
                loading: false,
                error: false
            });
            _this.clearPreviewCanvas();
        }).catch(function () { return _this.setState({
            loading: false,
            error: true
        }); });
    };
    ImageLoader.prototype.clearPreviewCanvas = function () {
        var _a = this.canvas, width = _a.width, height = _a.height;
        this.canvasContext.clearRect(0, 0, width, height);
    };
    ImageLoader.prototype.removeEventListeners = function () {
        this.removers.forEach(function (listeners) { return listeners(); });
        this.removers = [];
    };
    ImageLoader.prototype.hasSize = function () {
        var _a = this.props, width = _a.width, height = _a.height;
        return typeof width === 'number' && typeof height === 'number';
    };
    ImageLoader.prototype.render = function () {
        var _a = this.props, alt = _a.alt, src = _a.src, width = _a.width, height = _a.height, onClick = _a.onClick;
        var loading = this.state.loading;
        var className = classnames__WEBPACK_IMPORTED_MODULE_1___default()('image-loader', {
            'image-loader--loading': loading,
            'image-loader--amorphous': !this.hasSize()
        });
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: className,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 140,
                columnNumber: 7
            }
        }, loading ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("canvas", {
            className: "image-loader__preview-canvas",
            ref: this.setCanvasRef,
            width: width,
            height: height,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 142,
                columnNumber: 11
            }
        }) : /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_zoomable_image__WEBPACK_IMPORTED_MODULE_4__["default"], {
            alt: alt,
            src: src,
            onClick: onClick,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 149,
                columnNumber: 11
            }
        }));
    };
    return ImageLoader;
}(react__WEBPACK_IMPORTED_MODULE_3__.PureComponent));
/* harmony default export */ __webpack_exports__["default"] = (ImageLoader);
_defineProperty(ImageLoader, "propTypes", {
    alt: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    src: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string.isRequired),
    previewSrc: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    width: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
    height: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number),
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func)
});
_defineProperty(ImageLoader, "defaultProps", {
    alt: '',
    width: null,
    height: null
});


/***/ }),

/***/ 1599:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/ui/components/media_modal.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ MediaModal; }
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ 8);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-immutable-proptypes */ 172);
/* harmony import */ var react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-immutable-pure-component */ 121);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-intl */ 55);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var react_swipeable_views__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-swipeable-views */ 1421);
/* harmony import */ var soapbox_components_extended_video_player__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/components/extended_video_player */ 1795);
/* harmony import */ var soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/icon */ 28);
/* harmony import */ var soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/components/icon_button */ 401);
/* harmony import */ var soapbox_features_audio__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/features/audio */ 1153);
/* harmony import */ var soapbox_features_video__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! soapbox/features/video */ 419);
/* harmony import */ var _image_loader__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./image_loader */ 1743);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _class, _class2, _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/media_modal.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }














var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_13__.defineMessages)({
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    previous: {
        "id": "lightbox.previous",
        "defaultMessage": "Previous"
    },
    next: {
        "id": "lightbox.next",
        "defaultMessage": "Next"
    }
});
var MediaModal = (0,react_intl__WEBPACK_IMPORTED_MODULE_14__["default"])(_class = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_15__.withRouter)(_class = (_class2 = /** @class */ (function (_super) {
    __extends(MediaModal, _super);
    function MediaModal() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            index: null,
            navigationHidden: false
        });
        _defineProperty(_this, "handleSwipe", function (index) {
            _this.setState({
                index: index % _this.props.media.size
            });
        });
        _defineProperty(_this, "handleNextClick", function () {
            _this.setState({
                index: (_this.getIndex() + 1) % _this.props.media.size
            });
        });
        _defineProperty(_this, "handlePrevClick", function () {
            _this.setState({
                index: (_this.props.media.size + _this.getIndex() - 1) % _this.props.media.size
            });
        });
        _defineProperty(_this, "handleChangeIndex", function (e) {
            var index = Number(e.currentTarget.getAttribute('data-index'));
            _this.setState({
                index: index % _this.props.media.size
            });
        });
        _defineProperty(_this, "handleKeyDown", function (e) {
            switch (e.key) {
                case 'ArrowLeft':
                    _this.handlePrevClick();
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 'ArrowRight':
                    _this.handleNextClick();
                    e.preventDefault();
                    e.stopPropagation();
                    break;
            }
        });
        _defineProperty(_this, "toggleNavigation", function () {
            _this.setState(function (prevState) { return ({
                navigationHidden: !prevState.navigationHidden
            }); });
        });
        _defineProperty(_this, "handleStatusClick", function (e) {
            if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                var _a = _this.props, status = _a.status, account = _a.account;
                var acct = account.get('acct');
                var statusId = status.get('id');
                _this.props.history.push("/@".concat(acct, "/posts/").concat(statusId));
                _this.props.onClose(null, true);
            }
        });
        _defineProperty(_this, "handleCloserClick", function (_ref) {
            var target = _ref.target;
            var whitelist = ['zoomable-image'];
            var activeSlide = document.querySelector('.media-modal .react-swipeable-view-container > div[aria-hidden="false"]');
            var isClickOutside = target === activeSlide || !activeSlide.contains(target);
            var isWhitelisted = whitelist.some(function (w) { return target.classList.contains(w); });
            if (isClickOutside || isWhitelisted) {
                _this.props.onClose();
            }
        });
        return _this;
    }
    MediaModal.prototype.componentDidMount = function () {
        window.addEventListener('keydown', this.handleKeyDown, false);
    };
    MediaModal.prototype.componentWillUnmount = function () {
        window.removeEventListener('keydown', this.handleKeyDown);
    };
    MediaModal.prototype.getIndex = function () {
        return this.state.index !== null ? this.state.index : this.props.index;
    };
    MediaModal.prototype.render = function () {
        var _this = this;
        var _a = this.props, media = _a.media, status = _a.status, account = _a.account, intl = _a.intl, onClose = _a.onClose;
        var navigationHidden = this.state.navigationHidden;
        var index = this.getIndex();
        var pagination = [];
        var leftNav = media.size > 1 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("button", {
            tabIndex: "0",
            className: "media-modal__nav media-modal__nav--left",
            onClick: this.handlePrevClick,
            "aria-label": intl.formatMessage(messages.previous),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 123,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
            src: __webpack_require__(/*! @tabler/icons/arrow-left.svg */ 1055),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 124,
                columnNumber: 9
            }
        }));
        var rightNav = media.size > 1 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("button", {
            tabIndex: "0",
            className: "media-modal__nav  media-modal__nav--right",
            onClick: this.handleNextClick,
            "aria-label": intl.formatMessage(messages.next),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 129,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
            src: __webpack_require__(/*! @tabler/icons/arrow-right.svg */ 1058),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 130,
                columnNumber: 9
            }
        }));
        if (media.size > 1) {
            pagination = media.map(function (item, i) {
                var classes = ['media-modal__button'];
                if (i === index) {
                    classes.push('media-modal__button--active');
                }
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("li", {
                    className: "media-modal__page-dot",
                    key: i,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 140,
                        columnNumber: 17
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("button", {
                    tabIndex: "0",
                    className: classes.join(' '),
                    onClick: _this.handleChangeIndex,
                    "data-index": i,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 140,
                        columnNumber: 63
                    }
                }, i + 1));
            });
        }
        var isMultiMedia = media.map(function (image) {
            if (image.get('type') !== 'image') {
                return true;
            }
            return false;
        }).toArray();
        var content = media.map(function (attachment) {
            var width = attachment.getIn(['meta', 'original', 'width']) || null;
            var height = attachment.getIn(['meta', 'original', 'height']) || null;
            var link = status && account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
                href: status.get('url'),
                onClick: _this.handleStatusClick,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 155,
                    columnNumber: 42
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
                id: "lightbox.view_context",
                defaultMessage: "View context",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 155,
                    columnNumber: 103
                }
            }));
            if (attachment.get('type') === 'image') {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_image_loader__WEBPACK_IMPORTED_MODULE_12__["default"], {
                    previewSrc: attachment.get('preview_url'),
                    src: attachment.get('url'),
                    width: width,
                    height: height,
                    alt: attachment.get('description'),
                    key: attachment.get('url'),
                    onClick: _this.toggleNavigation,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 159,
                        columnNumber: 11
                    }
                });
            }
            else if (attachment.get('type') === 'video') {
                var time = _this.props.time;
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_video__WEBPACK_IMPORTED_MODULE_11__["default"], {
                    preview: attachment.get('preview_url'),
                    blurhash: attachment.get('blurhash'),
                    src: attachment.get('url'),
                    width: attachment.get('width'),
                    height: attachment.get('height'),
                    startTime: time || 0,
                    onCloseVideo: onClose,
                    detailed: true,
                    link: link,
                    alt: attachment.get('description'),
                    key: attachment.get('url'),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 173,
                        columnNumber: 11
                    }
                });
            }
            else if (attachment.get('type') === 'audio') {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_features_audio__WEBPACK_IMPORTED_MODULE_10__["default"], {
                    src: attachment.get('url'),
                    alt: attachment.get('description'),
                    poster: attachment.get('preview_url') !== attachment.get('url') ? attachment.get('preview_url') : status && status.getIn(['account', 'avatar_static']),
                    backgroundColor: attachment.getIn(['meta', 'colors', 'background']),
                    foregroundColor: attachment.getIn(['meta', 'colors', 'foreground']),
                    accentColor: attachment.getIn(['meta', 'colors', 'accent']),
                    duration: attachment.getIn(['meta', 'original', 'duration'], 0),
                    key: attachment.get('url'),
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 189,
                        columnNumber: 11
                    }
                });
            }
            else if (attachment.get('type') === 'gifv') {
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_extended_video_player__WEBPACK_IMPORTED_MODULE_7__["default"], {
                    src: attachment.get('url'),
                    muted: true,
                    controls: false,
                    width: width,
                    link: link,
                    height: height,
                    key: attachment.get('preview_url'),
                    alt: attachment.get('description'),
                    onClick: _this.toggleNavigation,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 202,
                        columnNumber: 11
                    }
                });
            }
            return null;
        }).toArray(); // you can't use 100vh, because the viewport height is taller
        // than the visible part of the document in some mobile
        // browsers when it's address bar is visible.
        // https://developers.google.com/web/updates/2016/12/url-bar-resizing
        var swipeableViewsStyle = {
            width: '100%',
            height: '100%'
        };
        var containerStyle = {
            alignItems: 'center' // center vertically
        };
        var navigationClassName = classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-modal__navigation', {
            'media-modal__navigation--hidden': navigationHidden
        });
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "modal-root__modal media-modal",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 237,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: "media-modal__closer",
            role: "presentation",
            onClick: this.handleCloserClick,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 238,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_swipeable_views__WEBPACK_IMPORTED_MODULE_6__["default"], {
            style: swipeableViewsStyle,
            containerStyle: containerStyle,
            onChangeIndex: this.handleSwipe,
            onSwitching: this.handleSwitching,
            index: index,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 243,
                columnNumber: 11
            }
        }, content)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: navigationClassName,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 254,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_icon_button__WEBPACK_IMPORTED_MODULE_9__["default"], {
            className: "media-modal__close",
            title: intl.formatMessage(messages.close),
            src: __webpack_require__(/*! @tabler/icons/x.svg */ 56),
            onClick: onClose,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 255,
                columnNumber: 11
            }
        }), leftNav, rightNav, status && !isMultiMedia[index] && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("div", {
            className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('media-modal__meta', {
                'media-modal__meta--shifted': media.size > 1
            }),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 261,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("a", {
            href: status.get('url'),
            onClick: this.handleStatusClick,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 262,
                columnNumber: 15
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__["default"], {
            id: "lightbox.view_context",
            defaultMessage: "View context",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 262,
                columnNumber: 76
            }
        }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement("ul", {
            className: "media-modal__pagination",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 266,
                columnNumber: 11
            }
        }, pagination)));
    };
    return MediaModal;
}(react_immutable_pure_component__WEBPACK_IMPORTED_MODULE_5__["default"])), _defineProperty(_class2, "propTypes", {
    media: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().list.isRequired),
    status: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().record),
    account: (react_immutable_proptypes__WEBPACK_IMPORTED_MODULE_4___default().record),
    index: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().number.isRequired),
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired),
    intl: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object.isRequired),
    history: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object)
}), _class2)) || _class) || _class;



/***/ }),

/***/ 1616:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/ui/components/mentions_modal.tsx ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/statuses */ 58);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1020);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/containers/account_container */ 120);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/selectors */ 31);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/mentions_modal.tsx";









var getStatus = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_6__.makeGetStatus)();
var MentionsModal = function (_ref) {
    var onClose = _ref.onClose, statusId = _ref.statusId;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return getStatus(state, {
        id: statusId
    }); });
    var accountIds = status ? (0,immutable__WEBPACK_IMPORTED_MODULE_7__.OrderedSet)(status.mentions.map(function (m) { return m.get('id'); })) : null;
    var fetchData = function () {
        dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_1__.fetchStatusWithContext)(statusId));
    };
    var onClickClose = function () {
        onClose('MENTIONS');
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        fetchData();
    }, []);
    var body;
    if (!accountIds) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 40,
                columnNumber: 12
            }
        });
    }
    else {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_2__["default"], {
            scrollKey: "mentions",
            itemClassName: "pb-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 43,
                columnNumber: 7
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_4__["default"], {
            key: id,
            id: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 48,
                columnNumber: 11
            }
        }); }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_3__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_8__["default"], {
            id: "column.mentions",
            defaultMessage: "Mentions",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 56,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (MentionsModal);


/***/ }),

/***/ 1603:
/*!**************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/missing_description_modal.tsx ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-intl */ 55);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/missing_description_modal.tsx";



var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_2__.defineMessages)({
    modalTitle: {
        "id": "missing_description_modal.text",
        "defaultMessage": "You have not entered a description for all attachments."
    },
    post: {
        "id": "missing_description_modal.continue",
        "defaultMessage": "Post"
    },
    cancel: {
        "id": "missing_description_modal.cancel",
        "defaultMessage": "Cancel"
    }
});
var MissingDescriptionModal = function (_ref) {
    var onClose = _ref.onClose, onContinue = _ref.onContinue, intl = _ref.intl;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        title: intl.formatMessage(messages.modalTitle),
        confirmationAction: onContinue,
        confirmationText: intl.formatMessage(messages.post),
        confirmationTheme: "danger",
        cancelText: intl.formatMessage(messages.cancel),
        cancelAction: onClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 20,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", {
        className: "text-gray-600 dark:text-gray-300",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "missing_description_modal.description",
        defaultMessage: "Continue anyway?",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = ((0,react_intl__WEBPACK_IMPORTED_MODULE_4__["default"])(MissingDescriptionModal));


/***/ }),

/***/ 1847:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modal_loading.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modal_loading.tsx";

 // Keep the markup in sync with <BundleModalError />
// (make sure they have the same dimensions)
var ModalLoading = function () { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "modal-root__modal error-modal",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 8,
        columnNumber: 3
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "error-modal__body",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 9,
        columnNumber: 5
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Spinner, {
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 10,
        columnNumber: 7
    }
})), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "error-modal__footer",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 12,
        columnNumber: 5
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 13,
        columnNumber: 7
    }
}, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("button", {
    className: "error-modal__nav onboarding-modal__skip",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 14,
        columnNumber: 9
    }
})))); };
/* harmony default export */ __webpack_exports__["default"] = (ModalLoading);


/***/ }),

/***/ 1843:
/*!**********************************************************!*\
  !*** ./app/soapbox/features/ui/components/modal_root.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var soapbox_components_modal_root__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/modal_root */ 1844);
/* harmony import */ var soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/features/ui/util/async-components */ 44);
/* harmony import */ var _containers_bundle_container__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../containers/bundle_container */ 57);
/* harmony import */ var _bundle_modal_error__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./bundle_modal_error */ 1846);
/* harmony import */ var _modal_loading__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modal_loading */ 1847);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modal_root.js";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }


function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }







var MODAL_COMPONENTS = {
    'MEDIA': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.MediaModal,
    'VIDEO': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.VideoModal,
    'BOOST': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.BoostModal,
    'CONFIRM': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ConfirmationModal,
    'MISSING_DESCRIPTION': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.MissingDescriptionModal,
    'MUTE': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.MuteModal,
    'REPORT': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ReportModal,
    'ACTIONS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ActionsModal,
    'EMBED': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.EmbedModal,
    'LIST_EDITOR': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ListEditor,
    'FOCAL_POINT': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.FocalPointModal,
    'LIST_ADDER': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ListAdder,
    'HOTKEYS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.HotkeysModal,
    'COMPOSE': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ComposeModal,
    'REPLY_MENTIONS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ReplyMentionsModal,
    'UNAUTHORIZED': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.UnauthorizedModal,
    'CRYPTO_DONATE': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.CryptoDonateModal,
    'EDIT_FEDERATION': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.EditFederationModal,
    'COMPONENT': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ComponentModal,
    'REBLOGS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ReblogsModal,
    'FAVOURITES': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.FavouritesModal,
    'REACTIONS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.ReactionsModal,
    'MENTIONS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.MentionsModal,
    'LANDING_PAGE': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.LandingPageModal,
    'BIRTHDAYS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.BirthdaysModal,
    'ACCOUNT_NOTE': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.AccountNoteModal,
    'COMPARE_HISTORY': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.CompareHistoryModal,
    'VERIFY_SMS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.VerifySmsModal,
    'FAMILIAR_FOLLOWERS': soapbox_features_ui_util_async_components__WEBPACK_IMPORTED_MODULE_5__.FamiliarFollowersModal
};
var ModalRoot = /** @class */ (function (_super) {
    __extends(ModalRoot, _super);
    function ModalRoot() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "renderLoading", function (modalId) { return function () {
            return !['MEDIA', 'VIDEO', 'BOOST', 'CONFIRM', 'ACTIONS'].includes(modalId) ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_modal_loading__WEBPACK_IMPORTED_MODULE_8__["default"], {
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 95,
                    columnNumber: 83
                }
            }) : null;
        }; });
        _defineProperty(_this, "renderError", function (props) {
            return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_bundle_modal_error__WEBPACK_IMPORTED_MODULE_7__["default"], _extends({}, props, {
                onClose: _this.onClickClose,
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 99,
                    columnNumber: 12
                }
            }));
        });
        _defineProperty(_this, "onClickClose", function (_) {
            var _a = _this.props, onClose = _a.onClose, type = _a.type;
            onClose(type);
        });
        return _this;
    }
    ModalRoot.prototype.getSnapshotBeforeUpdate = function () {
        return {
            visible: !!this.props.type
        };
    };
    ModalRoot.prototype.componentDidUpdate = function (prevProps, prevState, _ref) {
        var visible = _ref.visible;
        if (visible) {
            document.body.classList.add('with-modals');
        }
        else {
            document.body.classList.remove('with-modals');
        }
    };
    ModalRoot.prototype.render = function () {
        var _this = this;
        var _a = this.props, type = _a.type, props = _a.props;
        var visible = !!type;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(soapbox_components_modal_root__WEBPACK_IMPORTED_MODULE_4__["default"], {
            onClose: this.onClickClose,
            type: type,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 112,
                columnNumber: 7
            }
        }, visible && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_3__.createElement(_containers_bundle_container__WEBPACK_IMPORTED_MODULE_6__["default"], {
            fetchComponent: MODAL_COMPONENTS[type],
            loading: this.renderLoading(type),
            error: this.renderError,
            renderDelay: 200,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 114,
                columnNumber: 11
            }
        }, function (SpecificComponent) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_3__.createElement(SpecificComponent, _extends({}, props, {
            onClose: _this.onClickClose,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 115,
                columnNumber: 37
            }
        })); }));
    };
    return ModalRoot;
}(react__WEBPACK_IMPORTED_MODULE_3__.PureComponent));
/* harmony default export */ __webpack_exports__["default"] = (ModalRoot);
_defineProperty(ModalRoot, "propTypes", {
    type: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().string),
    props: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().object),
    onClose: (prop_types__WEBPACK_IMPORTED_MODULE_2___default().func.isRequired)
});


/***/ }),

/***/ 1687:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/ui/components/modals/verify-sms-modal.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.promise.finally.js */ 254);
/* harmony import */ var core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_otp_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-otp-input */ 1127);
/* harmony import */ var soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/actions/auth */ 34);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/actions/snackbar */ 23);
/* harmony import */ var soapbox_actions_verification__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/actions/verification */ 79);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_utils_auth__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/utils/auth */ 16);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/modals/verify-sms-modal.tsx";












var Statuses;
(function (Statuses) {
    Statuses["IDLE"] = "IDLE";
    Statuses["READY"] = "READY";
    Statuses["REQUESTED"] = "REQUESTED";
    Statuses["FAIL"] = "FAIL";
    Statuses["SUCCESS"] = "SUCCESS";
})(Statuses || (Statuses = {}));
var VerifySmsModal = function (_ref) {
    var onClose = _ref.onClose;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var accessToken = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return (0,soapbox_utils_auth__WEBPACK_IMPORTED_MODULE_10__.getAccessToken)(state); });
    var title = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.instance.title; });
    var isLoading = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_9__.useAppSelector)(function (state) { return state.verification.isLoading; });
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(Statuses.IDLE), status = _a[0], setStatus = _a[1];
    var _b = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(), phone = _b[0], setPhone = _b[1];
    var _c = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(''), verificationCode = _c[0], setVerificationCode = _c[1];
    var _d = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false), requestedAnother = _d[0], setAlreadyRequestedAnother = _d[1];
    var isValid = !!phone;
    var onChange = (0,react__WEBPACK_IMPORTED_MODULE_2__.useCallback)(function (phone) {
        setPhone(phone);
    }, []);
    var handleSubmit = function (event) {
        event.preventDefault();
        if (!isValid) {
            setStatus(Statuses.IDLE);
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].error(intl.formatMessage({
                id: 'sms_verification.invalid',
                defaultMessage: 'Please enter a valid phone number.'
            })));
            return;
        }
        dispatch((0,soapbox_actions_verification__WEBPACK_IMPORTED_MODULE_7__.reRequestPhoneVerification)(phone)).then(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].success(intl.formatMessage({
                id: 'sms_verification.success',
                defaultMessage: 'A verification code has been sent to your phone number.'
            })));
        }).finally(function () { return setStatus(Statuses.REQUESTED); }).catch(function () {
            dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].error(intl.formatMessage({
                id: 'sms_verification.fail',
                defaultMessage: 'Failed to send SMS message to your phone number.'
            })));
        });
    };
    var resendVerificationCode = function (event) {
        setAlreadyRequestedAnother(true);
        handleSubmit(event);
    };
    var onConfirmationClick = function (event) {
        switch (status) {
            case Statuses.IDLE:
                setStatus(Statuses.READY);
                break;
            case Statuses.READY:
                handleSubmit(event);
                break;
            case Statuses.REQUESTED:
                submitVerification();
                break;
            default:
                break;
        }
    };
    var confirmationText = (0,react__WEBPACK_IMPORTED_MODULE_2__.useMemo)(function () {
        switch (status) {
            case Statuses.IDLE:
                return intl.formatMessage({
                    id: 'sms_verification.modal.verify_sms',
                    defaultMessage: 'Verify SMS'
                });
            case Statuses.READY:
                return intl.formatMessage({
                    id: 'sms_verification.modal.verify_number',
                    defaultMessage: 'Verify phone number'
                });
            case Statuses.REQUESTED:
                return intl.formatMessage({
                    id: 'sms_verification.modal.verify_code',
                    defaultMessage: 'Verify code'
                });
            default:
                return null;
        }
    }, [status]);
    var renderModalBody = function () {
        switch (status) {
            case Statuses.IDLE:
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Text, {
                    theme: "muted",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 128,
                        columnNumber: 11
                    }
                }, intl.formatMessage({
                    id: 'sms_verification.modal.verify_help_text',
                    defaultMessage: 'Verify your phone number to start using {instance}.'
                }, {
                    instance: title
                }));
            case Statuses.READY:
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.FormGroup, {
                    labelText: "Phone Number",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 139,
                        columnNumber: 11
                    }
                }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.PhoneInput, {
                    value: phone,
                    onChange: onChange,
                    required: true,
                    autoFocus: true,
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 140,
                        columnNumber: 13
                    }
                }));
            case Statuses.REQUESTED:
                return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react__WEBPACK_IMPORTED_MODULE_2__.Fragment, null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Text, {
                    theme: "muted",
                    size: "sm",
                    align: "center",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 151,
                        columnNumber: 13
                    }
                }, intl.formatMessage({
                    id: 'sms_verification.modal.enter_code',
                    defaultMessage: 'We sent you a 6-digit code via SMS. Enter it below.'
                })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(react_otp_input__WEBPACK_IMPORTED_MODULE_3__["default"], {
                    value: verificationCode,
                    onChange: setVerificationCode,
                    numInputs: 6,
                    isInputNum: true,
                    shouldAutoFocus: true,
                    isDisabled: isLoading,
                    containerStyle: "flex justify-center mt-2 space-x-4",
                    inputStyle: "w-10i border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500",
                    __self: _this,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 158,
                        columnNumber: 13
                    }
                }));
            default:
                return null;
        }
    };
    var submitVerification = function () {
        // TODO: handle proper validation from Pepe -- expired vs invalid
        dispatch((0,soapbox_actions_verification__WEBPACK_IMPORTED_MODULE_7__.reConfirmPhoneVerification)(verificationCode)).then(function () {
            setStatus(Statuses.SUCCESS); // eslint-disable-next-line promise/catch-or-return
            dispatch((0,soapbox_actions_auth__WEBPACK_IMPORTED_MODULE_4__.verifyCredentials)(accessToken)).then(function () { return dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_5__.closeModal)('VERIFY_SMS')); });
        }).catch(function () { return dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_6__["default"].error(intl.formatMessage({
            id: 'sms_verification.invalid',
            defaultMessage: 'Your SMS token has expired.'
        }))); });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
        if (verificationCode.length === 6) {
            submitVerification();
        }
    }, [verificationCode]);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Modal, {
        title: intl.formatMessage({
            id: 'sms_verification.modal.verify_title',
            defaultMessage: 'Verify your phone number'
        }),
        onClose: function () { return onClose('VERIFY_SMS'); },
        cancelAction: status === Statuses.IDLE ? function () { return onClose('VERIFY_SMS'); } : undefined,
        cancelText: "Skip for now",
        confirmationAction: onConfirmationClick,
        confirmationText: confirmationText,
        secondaryAction: status === Statuses.REQUESTED ? resendVerificationCode : undefined,
        secondaryText: status === Statuses.REQUESTED ? intl.formatMessage({
            id: 'sms_verification.modal.resend_code',
            defaultMessage: 'Resend verification code?'
        }) : undefined,
        secondaryDisabled: requestedAnother,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 202,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_8__.Stack, {
        space: 4,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 221,
            columnNumber: 7
        }
    }, renderModalBody()));
};
/* harmony default export */ __webpack_exports__["default"] = (VerifySmsModal);


/***/ }),

/***/ 1645:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/panels/sign-up-panel.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/panels/sign-up-panel.tsx";




var SignUpPanel = function () {
    var singleUserMode = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useSoapboxConfig)().singleUserMode;
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.title; });
    var registrationOpen = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.instance.registrations; });
    var me = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.me; });
    if (me || singleUserMode || !registrationOpen)
        return null;
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 16,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 17,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        size: "lg",
        weight: "bold",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 18,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "signup_panel.title",
        defaultMessage: "New to {site_title}?",
        values: {
            site_title: siteTitle
        },
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 19,
            columnNumber: 11
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Text, {
        theme: "muted",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 22,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "signup_panel.subtitle",
        defaultMessage: "Sign up now to discuss.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 23,
            columnNumber: 11
        }
    }))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Button, {
        theme: "primary",
        block: true,
        to: "/signup",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 27,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "account.register",
        defaultMessage: "Sign up",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 9
        }
    })));
};
/* harmony default export */ __webpack_exports__["default"] = (SignUpPanel);


/***/ }),

/***/ 1615:
/*!****************************************************************!*\
  !*** ./app/soapbox/features/ui/components/reactions_modal.tsx ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! immutable */ 5);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/interactions */ 103);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1020);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/account_container */ 120);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_reducers_user_lists__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/reducers/user_lists */ 1088);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/reactions_modal.tsx";










var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_8__.defineMessages)({
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    all: {
        "id": "reactions.all",
        "defaultMessage": "All"
    }
});
var ReactionsModal = function (_ref) {
    var onClose = _ref.onClose, statusId = _ref.statusId, initialReaction = _ref.reaction;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_9__["default"])();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialReaction), reaction = _a[0], setReaction = _a[1];
    var reactions = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$user_lists$fav, _state$user_lists$rea;
        var favourites = (_state$user_lists$fav = state.user_lists.favourited_by.get(statusId)) === null || _state$user_lists$fav === void 0 ? void 0 : _state$user_lists$fav.items;
        var reactions = (_state$user_lists$rea = state.user_lists.reactions.get(statusId)) === null || _state$user_lists$rea === void 0 ? void 0 : _state$user_lists$rea.items;
        return favourites && reactions && (0,immutable__WEBPACK_IMPORTED_MODULE_10__.List)(favourites !== null && favourites !== void 0 && favourites.size ? [(0,soapbox_reducers_user_lists__WEBPACK_IMPORTED_MODULE_7__.ReactionRecord)({
                accounts: favourites,
                count: favourites.size,
                name: '👍'
            })] : []).concat(reactions || []);
    });
    var fetchData = function () {
        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_2__.fetchFavourites)(statusId));
        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_2__.fetchReactions)(statusId));
    };
    var onClickClose = function () {
        onClose('REACTIONS');
    };
    var renderFilterBar = function () {
        var items = [{
                text: intl.formatMessage(messages.all),
                action: function () { return setReaction(''); },
                name: 'all'
            }];
        reactions.forEach(function (reaction) { return items.push({
            text: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
                className: "flex items-center gap-1",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 57,
                    columnNumber: 15
                }
            }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.EmojiReact, {
                className: "w-4 h-4",
                emoji: (0,immutable__WEBPACK_IMPORTED_MODULE_10__.Map)(reaction),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 58,
                    columnNumber: 11
                }
            }), reaction.count),
            action: function () { return setReaction(reaction.name); },
            name: reaction.name
        }); });
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Tabs, {
            items: items,
            activeItem: reaction || 'all',
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 66,
                columnNumber: 12
            }
        });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
        fetchData();
    }, []);
    var accounts = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        if (!reactions)
            return null;
        if (reaction) {
            var selected_1 = reactions.find(function (_ref2) {
                var name = _ref2.name;
                return name === reaction;
            });
            return selected_1 === null || selected_1 === void 0 ? void 0 : selected_1.accounts.map(function (account) { return ({
                id: account,
                reaction: selected_1
            }); });
        }
        return reactions.map(function (_ref3) {
            var accounts = _ref3.accounts, name = _ref3.name, url = _ref3.url;
            return accounts.map(function (account) { return ({
                id: account,
                reaction: (0,immutable__WEBPACK_IMPORTED_MODULE_10__.Map)({
                    name: name,
                    url: url
                })
            }); });
        }).flatten();
    }, [reactions, reaction]);
    var body;
    if (!accounts) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 88,
                columnNumber: 12
            }
        });
    }
    else {
        var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "status.reactions.empty",
            defaultMessage: "No one has reacted to this post yet. When someone does, they will show up here.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 90,
                columnNumber: 26
            }
        });
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, reactions.size > 0 && renderFilterBar(), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
            scrollKey: "reactions",
            emptyMessage: emptyMessage,
            className: "mt-4",
            itemClassName: "pb-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 93,
                columnNumber: 7
            }
        }, accounts.map(function (account) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: "".concat(account.id, "-").concat(account.reaction),
            id: account.id,
            emoji: account.reaction,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 100,
                columnNumber: 11
            }
        }); })));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_11__["default"], {
            id: "column.reactions",
            defaultMessage: "Reactions",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 108,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 107,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (ReactionsModal);


/***/ }),

/***/ 1613:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/reblogs_modal.tsx ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/interactions */ 103);
/* harmony import */ var soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/statuses */ 58);
/* harmony import */ var soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/scrollable_list */ 1020);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/containers/account_container */ 120);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/reblogs_modal.tsx";








var ReblogsModal = function (_ref) {
    var onClose = _ref.onClose, statusId = _ref.statusId;
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppDispatch)();
    var accountIds = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) {
        var _state$user_lists$reb;
        return (_state$user_lists$reb = state.user_lists.reblogged_by.get(statusId)) === null || _state$user_lists$reb === void 0 ? void 0 : _state$user_lists$reb.items;
    });
    var fetchData = function () {
        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_1__.fetchReblogs)(statusId));
        dispatch((0,soapbox_actions_statuses__WEBPACK_IMPORTED_MODULE_2__.fetchStatus)(statusId));
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        fetchData();
    }, []);
    var onClickClose = function () {
        onClose('REBLOGS');
    };
    var body;
    if (!accountIds) {
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Spinner, {
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 36,
                columnNumber: 12
            }
        });
    }
    else {
        var emptyMessage = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "status.reblogs.empty",
            defaultMessage: "No one has reposted this post yet. When someone does, they will show up here.",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 38,
                columnNumber: 26
            }
        });
        body = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_scrollable_list__WEBPACK_IMPORTED_MODULE_3__["default"], {
            scrollKey: "reblogs",
            emptyMessage: emptyMessage,
            itemClassName: "pb-3",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 41,
                columnNumber: 7
            }
        }, accountIds.map(function (id) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_containers_account_container__WEBPACK_IMPORTED_MODULE_5__["default"], {
            key: id,
            id: id,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 47,
                columnNumber: 11
            }
        }); }));
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__["default"], {
            id: "column.reblogs",
            defaultMessage: "Reposts",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 55,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 54,
            columnNumber: 5
        }
    }, body);
};
/* harmony default export */ __webpack_exports__["default"] = (ReblogsModal);


/***/ }),

/***/ 1608:
/*!*********************************************************************!*\
  !*** ./app/soapbox/features/ui/components/reply_mentions_modal.tsx ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_reducers_compose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/reducers/compose */ 448);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/selectors */ 31);
/* harmony import */ var _reply_mentions_account__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../reply_mentions/account */ 1797);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/reply_mentions_modal.tsx";







var ReplyMentionsModal = function (_ref) {
    var onClose = _ref.onClose;
    var status = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_4__.makeGetStatus)()(state, {
        id: state.compose.in_reply_to
    }); });
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_2__.useAppSelector)(function (state) { return state.accounts.get(state.me); });
    var mentions = (0,soapbox_reducers_compose__WEBPACK_IMPORTED_MODULE_3__.statusToMentionsAccountIdsArray)(status, account);
    var author = (status === null || status === void 0 ? void 0 : status.account).id;
    var onClickClose = function () {
        onClose('REPLY_MENTIONS');
    };
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_1__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_6__["default"], {
            id: "navigation_bar.in_reply_to",
            defaultMessage: "In reply to",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 30,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        closeIcon: __webpack_require__(/*! @tabler/icons/arrow-left.svg */ 1055),
        closePosition: "left",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "reply-mentions-modal__accounts",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 7
        }
    }, mentions.map(function (accountId) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_reply_mentions_account__WEBPACK_IMPORTED_MODULE_5__["default"], {
        key: accountId,
        accountId: accountId,
        author: author === accountId,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 36
        }
    }); })));
};
/* harmony default export */ __webpack_exports__["default"] = (ReplyMentionsModal);


/***/ }),

/***/ 1609:
/*!*******************************************************************!*\
  !*** ./app/soapbox/features/ui/components/unauthorized_modal.tsx ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-intl */ 6);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/interactions */ 103);
/* harmony import */ var soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/snackbar */ 23);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/hooks */ 3);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/unauthorized_modal.tsx";








var messages = (0,react_intl__WEBPACK_IMPORTED_MODULE_6__.defineMessages)({
    close: {
        "id": "lightbox.close",
        "defaultMessage": "Close"
    },
    accountPlaceholder: {
        "id": "remote_interaction.account_placeholder",
        "defaultMessage": "Enter your username@domain you want to act from"
    },
    userNotFoundError: {
        "id": "remote_interaction.user_not_found_error",
        "defaultMessage": "Couldn't find given user"
    }
});
/** Modal to display when a logged-out user tries to do something that requires login. */
var UnauthorizedModal = function (_ref) {
    var action = _ref.action, onClose = _ref.onClose, accountId = _ref.account, apId = _ref.ap_id;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_8__.useHistory)();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppDispatch)();
    var singleUserMode = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useSoapboxConfig)().singleUserMode;
    var siteTitle = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) { return state.instance.title; });
    var username = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useAppSelector)(function (state) {
        var _state$accounts$get;
        return (_state$accounts$get = state.accounts.get(accountId)) === null || _state$accounts$get === void 0 ? void 0 : _state$accounts$get.display_name;
    });
    var features = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_5__.useFeatures)();
    var _a = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(''), account = _a[0], setAccount = _a[1];
    var onAccountChange = function (e) {
        setAccount(e.target.value);
    };
    var onClickClose = function () {
        onClose('UNAUTHORIZED');
    };
    var onSubmit = function (e) {
        e.preventDefault();
        dispatch((0,soapbox_actions_interactions__WEBPACK_IMPORTED_MODULE_2__.remoteInteraction)(apId, account)).then(function (url) {
            window.open(url, '_new', 'noopener,noreferrer');
            onClose('UNAUTHORIZED');
        }).catch(function (error) {
            if (error.message === 'Couldn\'t find user') {
                dispatch(soapbox_actions_snackbar__WEBPACK_IMPORTED_MODULE_3__["default"].error(intl.formatMessage(messages.userNotFoundError)));
            }
        });
    };
    var onLogin = function () {
        history.push('/login');
        onClickClose();
    };
    var onRegister = function () {
        history.push('/signup');
        onClickClose();
    };
    var renderRemoteInteractions = function () {
        var header;
        var button;
        if (action === 'FOLLOW') {
            header = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.follow_title",
                defaultMessage: "Follow {user} remotely",
                values: {
                    user: username
                },
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 78,
                    columnNumber: 16
                }
            });
            button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.follow",
                defaultMessage: "Proceed to follow",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 79,
                    columnNumber: 16
                }
            });
        }
        else if (action === 'REPLY') {
            header = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.reply_title",
                defaultMessage: "Reply to a post remotely",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 81,
                    columnNumber: 16
                }
            });
            button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.reply",
                defaultMessage: "Proceed to reply",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 82,
                    columnNumber: 16
                }
            });
        }
        else if (action === 'REBLOG') {
            header = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.reblog_title",
                defaultMessage: "Reblog a post remotely",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 84,
                    columnNumber: 16
                }
            });
            button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.reblog",
                defaultMessage: "Proceed to repost",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 85,
                    columnNumber: 16
                }
            });
        }
        else if (action === 'FAVOURITE') {
            header = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.favourite_title",
                defaultMessage: "Like a post remotely",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 87,
                    columnNumber: 16
                }
            });
            button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.favourite",
                defaultMessage: "Proceed to like",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 88,
                    columnNumber: 16
                }
            });
        }
        else if (action === 'POLL_VOTE') {
            header = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.poll_vote_title",
                defaultMessage: "Vote in a poll remotely",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 90,
                    columnNumber: 16
                }
            });
            button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "remote_interaction.poll_vote",
                defaultMessage: "Proceed to vote",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 91,
                    columnNumber: 16
                }
            });
        }
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Modal, {
            title: header,
            onClose: onClickClose,
            confirmationAction: !singleUserMode ? onLogin : undefined,
            confirmationText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "account.login",
                defaultMessage: "Log in",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 99,
                    columnNumber: 27
                }
            }),
            secondaryAction: onRegister,
            secondaryText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
                id: "account.register",
                defaultMessage: "Sign up",
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 101,
                    columnNumber: 24
                }
            }),
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 95,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "remote-interaction-modal__content",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 103,
                columnNumber: 9
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("form", {
            className: "simple_form remote-interaction-modal__fields",
            onSubmit: onSubmit,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 104,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("input", {
            type: "text",
            placeholder: intl.formatMessage(messages.accountPlaceholder),
            name: "remote_follow[acct]",
            value: account,
            autoCorrect: "off",
            autoCapitalize: "off",
            onChange: onAccountChange,
            required: true,
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 105,
                columnNumber: 13
            }
        }), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Button, {
            type: "submit",
            theme: "primary",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 115,
                columnNumber: 13
            }
        }, button)), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
            className: "remote-interaction-modal__divider",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 117,
                columnNumber: 11
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            align: "center",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 118,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "remote_interaction.divider",
            defaultMessage: "or",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 119,
                columnNumber: 15
            }
        }))), !singleUserMode && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
            size: "lg",
            weight: "medium",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 123,
                columnNumber: 13
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "unauthorized_modal.title",
            defaultMessage: "Sign up for {site_title}",
            values: {
                site_title: siteTitle
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 124,
                columnNumber: 15
            }
        }))));
    };
    if (action && features.remoteInteractions && features.federating) {
        return renderRemoteInteractions();
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Modal, {
        title: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "unauthorized_modal.title",
            defaultMessage: "Sign up for {site_title}",
            values: {
                site_title: siteTitle
            },
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 138,
                columnNumber: 14
            }
        }),
        onClose: onClickClose,
        confirmationAction: onLogin,
        confirmationText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "account.login",
            defaultMessage: "Log in",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 141,
                columnNumber: 25
            }
        }),
        secondaryAction: onRegister,
        secondaryText: /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
            id: "account.register",
            defaultMessage: "Sign up",
            __self: _this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 143,
                columnNumber: 22
            }
        }),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 137,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 145,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 146,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_9__["default"], {
        id: "unauthorized_modal.text",
        defaultMessage: "You need to be logged in to do that.",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 147,
            columnNumber: 11
        }
    }))));
};
/* harmony default export */ __webpack_exports__["default"] = (UnauthorizedModal);


/***/ }),

/***/ 1644:
/*!***********************************************************!*\
  !*** ./app/soapbox/features/ui/components/user_panel.tsx ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ 11);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-router-dom */ 27);
/* harmony import */ var soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/avatar */ 403);
/* harmony import */ var soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/components/still_image */ 176);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_components_verification_badge__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! soapbox/components/verification_badge */ 179);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! soapbox/selectors */ 31);
/* harmony import */ var soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! soapbox/utils/accounts */ 102);
/* harmony import */ var soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! soapbox/utils/numbers */ 106);
/* harmony import */ var soapbox_utils_state__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! soapbox/utils/state */ 123);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/user_panel.tsx";













var getAccount = (0,soapbox_selectors__WEBPACK_IMPORTED_MODULE_7__.makeGetAccount)();
var UserPanel = function (_ref) {
    var accountId = _ref.accountId, action = _ref.action, badges = _ref.badges, domain = _ref.domain;
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_11__["default"])();
    var account = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return getAccount(state, accountId); });
    var fqn = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_6__.useAppSelector)(function (state) { return (0,soapbox_utils_state__WEBPACK_IMPORTED_MODULE_10__.displayFqn)(state); });
    if (!account)
        return null;
    var displayNameHtml = {
        __html: account.get('display_name_html')
    };
    var acct = !account.get('acct').includes('@') && domain ? "".concat(account.get('acct'), "@").concat(domain) : account.get('acct');
    var header = account.get('header');
    var verified = account.get('verified');
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 36,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        space: 2,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 37,
            columnNumber: 7
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 38,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "-mt-4 -mx-4 h-24 bg-gray-200 relative",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 39,
            columnNumber: 11
        }
    }, header && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_still_image__WEBPACK_IMPORTED_MODULE_3__["default"], {
        src: account.get('header'),
        className: "absolute inset-0 object-cover",
        alt: "",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 41,
            columnNumber: 15
        }
    })), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        justifyContent: "between",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 49,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.Link, {
        to: "/@".concat(account.get('acct')),
        title: acct,
        className: "-mt-12 block",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 50,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_avatar__WEBPACK_IMPORTED_MODULE_2__["default"], {
        account: account,
        className: "h-20 w-20 bg-gray-50 ring-2 ring-white",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 55,
            columnNumber: 15
        }
    })), action && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", {
        className: "mt-2",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 62,
            columnNumber: 15
        }
    }, action))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Stack, {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 67,
            columnNumber: 9
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.Link, {
        to: "/@".concat(account.get('acct')),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 68,
            columnNumber: 11
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        space: 1,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 69,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        size: "lg",
        weight: "bold",
        dangerouslySetInnerHTML: displayNameHtml,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 70,
            columnNumber: 15
        }
    }), verified && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_verification_badge__WEBPACK_IMPORTED_MODULE_5__["default"], {
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 28
        }
    }), badges && badges.length > 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        space: 1,
        alignItems: "center",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 75,
            columnNumber: 17
        }
    }, badges))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        size: "sm",
        theme: "muted",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 82,
            columnNumber: 11
        }
    }, "@", (0,soapbox_utils_accounts__WEBPACK_IMPORTED_MODULE_8__.getAcct)(account, fqn))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        alignItems: "center",
        space: 3,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 87,
            columnNumber: 9
        }
    }, account.get('followers_count') >= 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.Link, {
        to: "/@".concat(account.get('acct'), "/followers"),
        title: intl.formatNumber(account.get('followers_count')),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 89,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        alignItems: "center",
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 90,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        theme: "primary",
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 91,
            columnNumber: 17
        }
    }, (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.shortNumberFormat)(account.get('followers_count'))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 94,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "account.followers",
        defaultMessage: "Followers",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 95,
            columnNumber: 19
        }
    })))), account.get('following_count') >= 0 && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_12__.Link, {
        to: "/@".concat(account.get('acct'), "/following"),
        title: intl.formatNumber(account.get('following_count')),
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 102,
            columnNumber: 13
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.HStack, {
        alignItems: "center",
        space: 1,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 103,
            columnNumber: 15
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        theme: "primary",
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 104,
            columnNumber: 17
        }
    }, (0,soapbox_utils_numbers__WEBPACK_IMPORTED_MODULE_9__.shortNumberFormat)(account.get('following_count'))), /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_4__.Text, {
        weight: "bold",
        size: "sm",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 107,
            columnNumber: 17
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_13__["default"], {
        id: "account.follows",
        defaultMessage: "Follows",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 108,
            columnNumber: 19
        }
    })))))));
};
/* harmony default export */ __webpack_exports__["default"] = (UserPanel);


/***/ }),

/***/ 1600:
/*!************************************************************!*\
  !*** ./app/soapbox/features/ui/components/video_modal.tsx ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-intl */ 10);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_features_video__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/features/video */ 419);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/video_modal.tsx";




var VideoModal = function (_ref) {
    var status = _ref.status, account = _ref.account, media = _ref.media, time = _ref.time, onClose = _ref.onClose;
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_2__.useHistory)();
    var handleStatusClick = function (e) {
        if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            history.push("/@".concat(account.acct, "/posts/").concat(status.id));
        }
    };
    var link = status && account && /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("a", {
        href: status.url,
        onClick: handleStatusClick,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 28,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_intl__WEBPACK_IMPORTED_MODULE_3__["default"], {
        id: "lightbox.view_context",
        defaultMessage: "View context",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 29,
            columnNumber: 7
        }
    }));
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        className: "block w-full max-w-xl mx-auto overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl pointer-events-auto",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 34,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_features_video__WEBPACK_IMPORTED_MODULE_1__["default"], {
        preview: media.preview_url,
        blurhash: media.blurhash,
        src: media.url,
        startTime: time,
        onCloseVideo: onClose,
        link: link,
        detailed: true,
        alt: media.description,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 35,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (VideoModal);


/***/ }),

/***/ 1796:
/*!**************************************************************!*\
  !*** ./app/soapbox/features/ui/components/zoomable_image.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ 1);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ 0);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/components/zoomable_image.js";

function _defineProperty(obj, key, value) { if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
}
else {
    obj[key] = value;
} return obj; }


var MIN_SCALE = 1;
var MAX_SCALE = 4;
var getMidpoint = function (p1, p2) { return ({
    x: (p1.clientX + p2.clientX) / 2,
    y: (p1.clientY + p2.clientY) / 2
}); };
var getDistance = function (p1, p2) { return Math.sqrt(Math.pow(p1.clientX - p2.clientX, 2) + Math.pow(p1.clientY - p2.clientY, 2)); };
var clamp = function (min, max, value) { return Math.min(max, Math.max(min, value)); };
var ZoomableImage = /** @class */ (function (_super) {
    __extends(ZoomableImage, _super);
    function ZoomableImage() {
        var _this = _super.apply(this, arguments) || this;
        _defineProperty(_this, "state", {
            scale: MIN_SCALE
        });
        _defineProperty(_this, "removers", []);
        _defineProperty(_this, "container", null);
        _defineProperty(_this, "image", null);
        _defineProperty(_this, "lastTouchEndTime", 0);
        _defineProperty(_this, "lastDistance", 0);
        _defineProperty(_this, "handleTouchStart", function (e) {
            if (e.touches.length !== 2)
                return;
            _this.lastDistance = getDistance.apply(void 0, e.touches);
        });
        _defineProperty(_this, "handleTouchMove", function (e) {
            var _a = _this.container, scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
            if (e.touches.length === 1 && scrollTop !== scrollHeight - clientHeight) {
                // prevent propagating event to MediaModal
                e.stopPropagation();
                return;
            }
            if (e.touches.length !== 2)
                return;
            e.preventDefault();
            e.stopPropagation();
            var distance = getDistance.apply(void 0, e.touches);
            var midpoint = getMidpoint.apply(void 0, e.touches);
            var scale = clamp(MIN_SCALE, MAX_SCALE, _this.state.scale * distance / _this.lastDistance);
            _this.zoom(scale, midpoint);
            _this.lastMidpoint = midpoint;
            _this.lastDistance = distance;
        });
        _defineProperty(_this, "handleClick", function (e) {
            // don't propagate event to MediaModal
            e.stopPropagation();
            var handler = _this.props.onClick;
            if (handler)
                handler();
        });
        _defineProperty(_this, "setContainerRef", function (c) {
            _this.container = c;
        });
        _defineProperty(_this, "setImageRef", function (c) {
            _this.image = c;
        });
        return _this;
    }
    ZoomableImage.prototype.componentDidMount = function () {
        var _this = this;
        var handler = this.handleTouchStart;
        this.container.addEventListener('touchstart', handler);
        this.removers.push(function () { return _this.container.removeEventListener('touchstart', handler); });
        handler = this.handleTouchMove; // on Chrome 56+, touch event listeners will default to passive
        // https://www.chromestatus.com/features/5093566007214080
        this.container.addEventListener('touchmove', handler, {
            passive: false
        });
        this.removers.push(function () { return _this.container.removeEventListener('touchend', handler); });
    };
    ZoomableImage.prototype.componentWillUnmount = function () {
        this.removeEventListeners();
    };
    ZoomableImage.prototype.removeEventListeners = function () {
        this.removers.forEach(function (listeners) { return listeners(); });
        this.removers = [];
    };
    ZoomableImage.prototype.zoom = function (nextScale, midpoint) {
        var _this = this;
        var scale = this.state.scale;
        var _a = this.container, scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop; // math memo:
        // x = (scrollLeft + midpoint.x) / scrollWidth
        // x' = (nextScrollLeft + midpoint.x) / nextScrollWidth
        // scrollWidth = clientWidth * scale
        // scrollWidth' = clientWidth * nextScale
        // Solve x = x' for nextScrollLeft
        var nextScrollLeft = (scrollLeft + midpoint.x) * nextScale / scale - midpoint.x;
        var nextScrollTop = (scrollTop + midpoint.y) * nextScale / scale - midpoint.y;
        this.setState({
            scale: nextScale
        }, function () {
            _this.container.scrollLeft = nextScrollLeft;
            _this.container.scrollTop = nextScrollTop;
        });
    };
    ZoomableImage.prototype.render = function () {
        var _a = this.props, alt = _a.alt, src = _a.src;
        var scale = this.state.scale;
        var overflow = scale === 1 ? 'hidden' : 'scroll';
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("div", {
            className: "zoomable-image",
            ref: this.setContainerRef,
            style: {
                overflow: overflow
            },
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 131,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_2__.createElement("img", {
            role: "presentation",
            ref: this.setImageRef,
            alt: alt,
            title: alt,
            src: src,
            style: {
                transform: "scale(".concat(scale, ")"),
                transformOrigin: '0 0'
            },
            onClick: this.handleClick,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 136,
                columnNumber: 9
            }
        }));
    };
    return ZoomableImage;
}(react__WEBPACK_IMPORTED_MODULE_2__.PureComponent));
/* harmony default export */ __webpack_exports__["default"] = (ZoomableImage);
_defineProperty(ZoomableImage, "propTypes", {
    alt: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string),
    src: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().string.isRequired),
    width: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
    height: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().number),
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func)
});
_defineProperty(ZoomableImage, "defaultProps", {
    alt: '',
    width: null,
    height: null
});


/***/ }),

/***/ 1660:
/*!***************************************************************!*\
  !*** ./app/soapbox/features/ui/containers/modal_container.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react-redux */ 12);
/* harmony import */ var soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/compose */ 30);
/* harmony import */ var soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/actions/modals */ 17);
/* harmony import */ var soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/actions/reports */ 175);
/* harmony import */ var _components_modal_root__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/modal_root */ 1843);





var mapStateToProps = function (state) {
    var modal = state.get('modals').last({
        modalType: null,
        modalProps: {}
    });
    return {
        type: modal.modalType,
        props: modal.modalProps
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    onClose: function (type) {
        switch (type) {
            case 'COMPOSE':
                dispatch((0,soapbox_actions_compose__WEBPACK_IMPORTED_MODULE_1__.cancelReplyCompose)());
                break;
            case 'REPORT':
                dispatch((0,soapbox_actions_reports__WEBPACK_IMPORTED_MODULE_3__.cancelReport)());
                break;
            default:
                break;
        }
        dispatch((0,soapbox_actions_modals__WEBPACK_IMPORTED_MODULE_2__.closeModal)(type));
    }
}); };
/* harmony default export */ __webpack_exports__["default"] = ((0,react_redux__WEBPACK_IMPORTED_MODULE_0__.connect)(mapStateToProps, mapDispatchToProps)(_components_modal_root__WEBPACK_IMPORTED_MODULE_4__["default"]));


/***/ }),

/***/ 1659:
/*!************************************************************************!*\
  !*** ./app/soapbox/features/ui/containers/notifications_container.tsx ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react-intl */ 7);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react-router-dom */ 13);
/* harmony import */ var soapbox_actions_alerts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! soapbox/actions/alerts */ 69);
/* harmony import */ var soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! soapbox/components/ui */ 2);
/* harmony import */ var soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! soapbox/hooks */ 3);
/* harmony import */ var soapbox_react_notification__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! soapbox/react-notification */ 1841);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/features/ui/containers/notifications_container.tsx";







/** Portal for snackbar alerts. */
var SnackbarContainer = function () {
    var intl = (0,react_intl__WEBPACK_IMPORTED_MODULE_5__["default"])();
    var history = (0,react_router_dom__WEBPACK_IMPORTED_MODULE_6__.useHistory)();
    var dispatch = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppDispatch)();
    var alerts = (0,soapbox_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppSelector)(function (state) { return state.alerts; });
    /** Apply i18n to the message if it's an object. */
    var maybeFormatMessage = function (message) {
        switch (typeof message) {
            case 'string':
                return message;
            case 'object':
                return intl.formatMessage(message);
            default:
                return '';
        }
    };
    /** Convert a reducer Alert into a react-notification object. */
    var buildAlert = function (item) {
        // Backwards-compatibility
        if (item.actionLink) {
            item = item.set('action', function () { return history.push(item.actionLink); });
        }
        var alert = {
            message: maybeFormatMessage(item.message),
            title: maybeFormatMessage(item.title),
            key: item.key,
            className: "notification-bar-".concat(item.severity),
            activeClassName: 'snackbar--active',
            dismissAfter: item.dismissAfter,
            style: false
        };
        if (item.action && item.actionLabel) {
            // HACK: it's a JSX.Element instead of a string!
            // react-notification displays it just fine.
            alert.action = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_components_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                theme: "ghost",
                size: "sm",
                onClick: item.action,
                text: maybeFormatMessage(item.actionLabel),
                __self: _this,
                __source: {
                    fileName: _jsxFileName,
                    lineNumber: 50,
                    columnNumber: 9
                }
            });
        }
        return alert;
    };
    var onDismiss = function (alert) {
        dispatch((0,soapbox_actions_alerts__WEBPACK_IMPORTED_MODULE_1__.dismissAlert)(alert));
    };
    var defaultBarStyleFactory = function (index, style, _notification) {
        return Object.assign({}, style, {
            bottom: "".concat(14 + index * 12 + index * 42, "px")
        });
    };
    var notifications = alerts.toArray().map(buildAlert);
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
        role: "assertive",
        "data-testid": "toast",
        className: "z-1000 fixed inset-0 flex items-end px-4 py-6 pointer-events-none pt-16 lg:pt-20 sm:items-start",
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 72,
            columnNumber: 5
        }
    }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(soapbox_react_notification__WEBPACK_IMPORTED_MODULE_4__.NotificationStack, {
        onDismiss: onDismiss,
        onClick: onDismiss,
        barStyleFactory: defaultBarStyleFactory,
        activeBarStyleFactory: defaultBarStyleFactory,
        notifications: notifications,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 73,
            columnNumber: 7
        }
    }));
};
/* harmony default export */ __webpack_exports__["default"] = (SnackbarContainer);


/***/ }),

/***/ 883:
/*!************************************************************!*\
  !*** ./app/soapbox/react-notification/defaultPropTypes.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = ({
    message: prop_types__WEBPACK_IMPORTED_MODULE_0___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_0___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_0___default().element)]).isRequired,
    action: prop_types__WEBPACK_IMPORTED_MODULE_0___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool), (prop_types__WEBPACK_IMPORTED_MODULE_0___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_0___default().node)]),
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().func),
    style: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool),
    actionStyle: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().object),
    titleStyle: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().object),
    barStyle: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().object),
    activeBarStyle: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().object),
    dismissAfter: prop_types__WEBPACK_IMPORTED_MODULE_0___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool), (prop_types__WEBPACK_IMPORTED_MODULE_0___default().number)]),
    onDismiss: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().func),
    className: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().string),
    activeClassName: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().string),
    isActive: (prop_types__WEBPACK_IMPORTED_MODULE_0___default().bool),
    title: prop_types__WEBPACK_IMPORTED_MODULE_0___default().oneOfType([(prop_types__WEBPACK_IMPORTED_MODULE_0___default().string), (prop_types__WEBPACK_IMPORTED_MODULE_0___default().node)])
});


/***/ }),

/***/ 1841:
/*!*************************************************!*\
  !*** ./app/soapbox/react-notification/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Notification": function() { return /* reexport safe */ _notification__WEBPACK_IMPORTED_MODULE_0__["default"]; },
/* harmony export */   "NotificationStack": function() { return /* reexport safe */ _notificationStack__WEBPACK_IMPORTED_MODULE_1__["default"]; }
/* harmony export */ });
/* harmony import */ var _notification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notification */ 1711);
/* harmony import */ var _notificationStack__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notificationStack */ 1744);




/***/ }),

/***/ 1711:
/*!********************************************************!*\
  !*** ./app/soapbox/react-notification/notification.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _defaultPropTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultPropTypes */ 883);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/react-notification/notification.js";
/* linting temp disabled while working on updates */
/* eslint-disable */


var Notification = /** @class */ (function (_super) {
    __extends(Notification, _super);
    function Notification(props) {
        var _this = _super.call(this, props) || this;
        _this.getBarStyle = _this.getBarStyle.bind(_this);
        _this.getActionStyle = _this.getActionStyle.bind(_this);
        _this.getTitleStyle = _this.getTitleStyle.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        if (props.onDismiss && props.isActive) {
            _this.dismissTimeout = setTimeout(props.onDismiss, props.dismissAfter);
        }
        return _this;
    }
    Notification.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.dismissAfter === false)
            return; // See http://eslint.org/docs/rules/no-prototype-builtins
        if (!{}.hasOwnProperty.call(nextProps, 'isLast')) {
            clearTimeout(this.dismissTimeout);
        }
        if (nextProps.onDismiss) {
            if (nextProps.isActive && !this.props.isActive || nextProps.dismissAfter && this.props.dismissAfter === false) {
                this.dismissTimeout = setTimeout(nextProps.onDismiss, nextProps.dismissAfter);
            }
        }
    };
    Notification.prototype.componentWillUnmount = function () {
        if (this.props.dismissAfter)
            clearTimeout(this.dismissTimeout);
    };
    /*
    * @description Dynamically get the styles for the bar.
    * @returns {object} result The style.
    */
    Notification.prototype.getBarStyle = function () {
        if (this.props.style === false)
            return {};
        var _a = this.props, isActive = _a.isActive, barStyle = _a.barStyle, activeBarStyle = _a.activeBarStyle;
        var baseStyle = {
            position: 'fixed',
            bottom: '2rem',
            left: '-100%',
            width: 'auto',
            padding: '1rem',
            margin: 0,
            color: '#fafafa',
            font: '1rem normal Roboto, sans-serif',
            borderRadius: '5px',
            background: '#212121',
            borderSizing: 'border-box',
            boxShadow: '0 0 1px 1px rgba(10, 10, 11, .125)',
            cursor: 'default',
            WebKitTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
            MozTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
            msTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
            OTransition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
            transition: '.5s cubic-bezier(0.89, 0.01, 0.5, 1.1)',
            WebkitTransform: 'translatez(0)',
            MozTransform: 'translatez(0)',
            msTransform: 'translatez(0)',
            OTransform: 'translatez(0)',
            transform: 'translatez(0)'
        };
        return isActive ? Object.assign({}, baseStyle, {
            left: '1rem'
        }, barStyle, activeBarStyle) : Object.assign({}, baseStyle, barStyle);
    };
    /*
    * @function getActionStyle
    * @description Dynamically get the styles for the action text.
    * @returns {object} result The style.
    */
    Notification.prototype.getActionStyle = function () {
        return this.props.style !== false ? Object.assign({}, {
            padding: '0.125rem',
            marginLeft: '1rem',
            color: '#f44336',
            font: '.75rem normal Roboto, sans-serif',
            lineHeight: '1rem',
            letterSpacing: '.125ex',
            textTransform: 'uppercase',
            borderRadius: '5px',
            cursor: 'pointer'
        }, this.props.actionStyle) : {};
    };
    /*
    * @function getTitleStyle
    * @description Dynamically get the styles for the title.
    * @returns {object} result The style.
    */
    Notification.prototype.getTitleStyle = function () {
        return this.props.style !== false ? Object.assign({}, {
            fontWeight: '700',
            marginRight: '.5rem'
        }, this.props.titleStyle) : {};
    };
    /*
    * @function handleClick
    * @description Handle click events on the action button.
    */
    Notification.prototype.handleClick = function () {
        if (this.props.onClick && typeof this.props.onClick === 'function') {
            return this.props.onClick();
        }
    };
    Notification.prototype.render = function () {
        var className = 'notification-bar';
        if (this.props.isActive)
            className += " ".concat(this.props.activeClassName);
        if (this.props.className)
            className += " ".concat(this.props.className);
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: className,
            style: this.getBarStyle(),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 136,
                columnNumber: 7
            }
        }, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
            className: "notification-bar-wrapper",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 137,
                columnNumber: 9
            }
        }, this.props.title ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
            className: "notification-bar-title",
            style: this.getTitleStyle(),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 139,
                columnNumber: 13
            }
        }, this.props.title) : null, /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
            className: "notification-bar-message",
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 148,
                columnNumber: 11
            }
        }, this.props.message), this.props.action ? /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", {
            className: "notification-bar-action",
            onClick: this.handleClick,
            style: this.getActionStyle(),
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 153,
                columnNumber: 13
            }
        }, this.props.action) : null));
    };
    return Notification;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component));
Notification.propTypes = _defaultPropTypes__WEBPACK_IMPORTED_MODULE_1__["default"];
Notification.defaultProps = {
    isActive: false,
    dismissAfter: 2000,
    activeClassName: 'notification-bar-active'
};
/* harmony default export */ __webpack_exports__["default"] = (Notification);


/***/ }),

/***/ 1744:
/*!*************************************************************!*\
  !*** ./app/soapbox/react-notification/notificationStack.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! prop-types */ 15);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _stackedNotification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./stackedNotification */ 1842);
/* harmony import */ var _defaultPropTypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./defaultPropTypes */ 883);
var _this = undefined;
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/react-notification/notificationStack.js";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
/* linting temp disabled while working on updates */
/* eslint-disable */




function defaultBarStyleFactory(index, style) {
    return Object.assign({}, style, {
        bottom: "".concat(2 + index * 4, "rem")
    });
}
function defaultActionStyleFactory(index, style) {
    return Object.assign({}, style, {});
}
/**
* The notification list does not have any state, so use a
* pure function here. It just needs to return the stacked array
* of notification components.
*/
var NotificationStack = function (props) { /*#__PURE__*/ return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", {
    className: "notification-list",
    __self: _this,
    __source: {
        fileName: _jsxFileName,
        lineNumber: 30,
        columnNumber: 3
    }
}, props.notifications.map(function (notification, index) {
    var isLast = index === 0 && props.notifications.length === 1;
    var dismissNow = isLast || !props.dismissInOrder; // Handle styles
    var barStyle = props.barStyleFactory(index, notification.barStyle, notification);
    var actionStyle = props.actionStyleFactory(index, notification.actionStyle, notification);
    var activeBarStyle = props.activeBarStyleFactory(index, notification.activeBarStyle, notification); // Allow onClick from notification stack or individual notifications
    var onClick = notification.onClick || props.onClick;
    var onDismiss = props.onDismiss;
    var dismissAfter = notification.dismissAfter;
    if (dismissAfter !== false) {
        if (dismissAfter == null)
            dismissAfter = props.dismissAfter;
        if (!dismissNow)
            dismissAfter += index * 1000;
    }
    return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_stackedNotification__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, notification, {
        key: notification.key,
        isLast: isLast,
        action: notification.action || props.action,
        dismissAfter: dismissAfter,
        onDismiss: onDismiss.bind(_this, notification),
        onClick: onClick.bind(_this, notification),
        activeBarStyle: activeBarStyle,
        barStyle: barStyle,
        actionStyle: actionStyle,
        __self: _this,
        __source: {
            fileName: _jsxFileName,
            lineNumber: 56,
            columnNumber: 9
        }
    }));
})); };
/* eslint-disable react/no-unused-prop-types, react/forbid-prop-types */
NotificationStack.propTypes = {
    activeBarStyleFactory: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func),
    barStyleFactory: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func),
    actionStyleFactory: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func),
    dismissInOrder: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool),
    notifications: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().array.isRequired),
    onDismiss: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func.isRequired),
    onClick: (prop_types__WEBPACK_IMPORTED_MODULE_1___default().func),
    action: _defaultPropTypes__WEBPACK_IMPORTED_MODULE_3__["default"].action
};
NotificationStack.defaultProps = {
    activeBarStyleFactory: defaultBarStyleFactory,
    barStyleFactory: defaultBarStyleFactory,
    actionStyleFactory: defaultActionStyleFactory,
    dismissInOrder: true,
    dismissAfter: 1000,
    onClick: function () { }
};
/* eslint-enable no-alert, no-console */
/* harmony default export */ __webpack_exports__["default"] = (NotificationStack);


/***/ }),

/***/ 1842:
/*!***************************************************************!*\
  !*** ./app/soapbox/react-notification/stackedNotification.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 0);
/* harmony import */ var _defaultPropTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultPropTypes */ 883);
/* harmony import */ var _notification__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notification */ 1711);
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var _jsxFileName = "/home/runner/work/Mangane/Mangane/app/soapbox/react-notification/stackedNotification.js";
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
        }
    }
} return target; }; return _extends.apply(this, arguments); }
/* linting temp disabled while working on updates */
/* eslint-disable */



var StackedNotification = /** @class */ (function (_super) {
    __extends(StackedNotification, _super);
    function StackedNotification(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            isActive: false
        };
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    StackedNotification.prototype.componentDidMount = function () {
        this.activeTimeout = setTimeout(this.setState.bind(this, {
            isActive: true
        }), 1);
        this.dismiss(this.props.dismissAfter);
    };
    StackedNotification.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.dismissAfter !== this.props.dismissAfter) {
            this.dismiss(nextProps.dismissAfter);
        }
    };
    StackedNotification.prototype.componentWillUnmount = function () {
        clearTimeout(this.activeTimeout);
        clearTimeout(this.dismissTimeout);
    };
    StackedNotification.prototype.dismiss = function (dismissAfter) {
        if (dismissAfter === false)
            return;
        this.dismissTimeout = setTimeout(this.setState.bind(this, {
            isActive: false
        }), dismissAfter);
    };
    /*
    * @function handleClick
    * @description Bind deactivate Notification function to Notification click handler
    */
    StackedNotification.prototype.handleClick = function () {
        if (this.props.onClick && typeof this.props.onClick === 'function') {
            return this.props.onClick(this.setState.bind(this, {
                isActive: false
            }));
        }
    };
    StackedNotification.prototype.render = function () {
        var _this = this;
        return /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_0__.createElement(_notification__WEBPACK_IMPORTED_MODULE_2__["default"], _extends({}, this.props, {
            onClick: this.handleClick,
            onDismiss: function () { return setTimeout(_this.props.onDismiss, 300); },
            isActive: this.state.isActive,
            __self: this,
            __source: {
                fileName: _jsxFileName,
                lineNumber: 57,
                columnNumber: 7
            }
        }));
    };
    return StackedNotification;
}(react__WEBPACK_IMPORTED_MODULE_0__.Component));
StackedNotification.propTypes = _defaultPropTypes__WEBPACK_IMPORTED_MODULE_1__["default"];
/* harmony default export */ __webpack_exports__["default"] = (StackedNotification);


/***/ })

}]);
//# sourceMappingURL=ui-d589e46cf06e0cd4dc63.chunk.js.map