        /*!
        (C) Andrea Giammarchi, @WebReflection - Mit Style License
        */
        (function(wru) {
            window.wru = wru;
        }(function(Y) {
            function j() {
                A = K.call(m);
                if (A) {
                    if (typeof A == "function") {
                        A = {
                            name: A[S] || "anonymous",
                            test: A
                        }
                    }(P = l(l(Z.node, "div"), "span"))[E] = ((ag(A, S) && A[S]) || (ag(A, e) && A[e]) || Q) + i + i;
                    a = [];
                    u = [];
                    T = [];
                    ab = {};
                    b("setup");
                    T[ah] || b("test");
                    N || r()
                } else {
                    t()
                }
            }

            function p(aj) {
                try {
                    return O.call(h, aj)
                } catch (ai) {
                    return h.createElement(aj)
                }
            }

            function l(ai, aj) {
                return ai.appendChild(p(aj))
            }

            function g(ai) {
                P[E] = x.call(P[E], 0, -2) + i + ai
            }

            function t() {
                var ak = Z.node.insertBefore(p("div"), Z.node.firstChild),
                    al, aj, ai;
                if (ad) {
                    ai = aj = "error";
                    al = "There Are Errors: " + ad
                } else {
                    if (C) {
                        ai = aj = "fail";
                        al = C + " Tests Failed"
                    } else {
                        ai = aj = "pass";
                        al = "Passed " + s + " Tests"
                    }
                }
                Z.status = ai;
                ak[E] = "<strong>" + al + "</strong>";
                ak.className = aj
            }

            function G() {
                var ai = this.lastChild.style;
                ai.display = ai.display == "none" ? "block" : "none"
            }

            function c(ai) {
                P[E] += "<ul>" + D + v.call(ai, d + D) + d + "</ul>";
                (P.onclick = G).call(P)
            }

            function r() {
                f();
                s += a[ah];
                C += u[ah];
                ad += T[ah];
                g("(" + v.call([a[ah], M = u[ah], T[ah]], ", ") + ")");
                P = P.parentNode;
                T[ah] ? c(T, W = "error") : (M ? c(u, W = "fail") : W = "pass");
                P.className = W;
                M = 0;
                W = i;
                j()
            }

            function b(ai) {
                if (ag(A, ai)) {
                    try {
                        A[ai](ab)
                    } catch (aj) {
                        aa.call(T, i + aj)
                    }
                }
            }

            function ag(aj, ai) {
                return q.call(aj, ai)
            }

            function w() {
                return F() < 0.5 ? -1 : 1
            }

            function f() {
                if (R) {
                    H(R);
                    R = 0
                }
                b("teardown")
            }
            var Z = {
                    assert: function U(aj, ai) {
                        if (arguments[ah] == 1) {
                            ai = aj;
                            aj = Q
                        }
                        z = I;
                        aa.call(ai ? a : u, W + aj);
                        return ai
                    },
                    async: function V(aj, am, ak, al) {
                        al = ++N;
                        if (typeof aj == "function") {
                            ak = am;
                            am = aj;
                            aj = "asynchronous test #" + al
                        }
                        ak = X(function() {
                            al = 0;
                            aa.call(u, aj);
                            --N || (R = X(r, 0))
                        }, L(ak || y) || y);
                        return function ai() {
                            if (!al) {
                                return
                            }
                            z = ae;
                            W = aj + ": ";
                            try {
                                am.apply(this, arguments)
                            } catch (an) {
                                z = I;
                                aa.call(T, W + an)
                            }
                            W = i;
                            if (z) {
                                H(ak);
                                --N || (R = X(r, 0))
                            }
                        }
                    },
                    test: function n(ai, aj) {
                        Z.after = aj || function() {};
                        m = J.apply(m, [ai]);
                        Z.random && af.call(m, w);
                        N || j()
                    }
                },
                I = true,
                ae = !I,
                y = 100,
                i = " ",
                Q = "unknown",
                ah = "length",
                S = "name",
                e = "description",
                D = "<li>",
                d = "</li>",
                k = "\\|/-",
                q = Z.hasOwnProperty,
                W = i,
                ac = W.charAt,
                x = W.slice,
                m = [],
                J = m.concat,
                v = m.join,
                aa = m.push,
                K = m.shift,
                af = m.sort,
                N = 0,
                M = 0,
                s = 0,
                C = 0,
                ad = 0,
                R = 0,
                E = "innerHTML",
                h = Y.document,
                O = h.createElement,
                B, L, F, X, H, A, P, a, u, T, ab, z;
            B = Y.Math;
            L = B.abs;
            F = B.random;
            X = Y.setTimeout;
            H = Y.clearTimeout;
            Z.node = (h.getElementById("wru") || h.body || h.documentElement);
            Y.setInterval(function() {
                N && g(ac.call(k, M++ % 4))
            }, y);
            undefined;
            Z.log = function o(aj, ai) {
                ai ? alert(aj) : (typeof console != "undefined") && console.log(aj)
            };
            y *= y;
            Z.random = ae;
            return Z
        }(this)));