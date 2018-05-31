
#ifndef PY_OBJECT_WRAPPER_H
#define PY_OBJECT_WRAPPER_H

#include <napi.h>
#include <uv.h>
#include <Python.h>

#include "utils.h"
#include "FryCatch.h"

#define X_JS_INSTANCE_OF(JSREF, JSCLASS) JSREF.As<Napi::Object>().InstanceOf(JSCLASS::constructor.Value())

class JSPyObject : public Napi::ObjectWrap<JSPyObject> {
    public:
        explicit JSPyObject(const Napi::CallbackInfo& info);
        virtual ~JSPyObject();
    public:
        static Napi::FunctionReference constructor;
        static void Initialize(Napi::Env& env, Napi::Object& exports);

        Napi::Value getAttr(const Napi::CallbackInfo& info);
        Napi::Value call(const Napi::CallbackInfo& info);
        Napi::Value setAttr(const Napi::CallbackInfo& info);
        Napi::Value valueOf(const Napi::CallbackInfo& info);
        Napi::Value toString(const Napi::CallbackInfo& args);

        // Conversiion Matrix:
        // @Introspection: Should we even try to do this ? 
        // Calling C++ is expensive, we should only cross ABI
        // boundries if and only if necessary because we are going to
        // be hit twice each time we cross the ABI boundary 

        // Too Complex <-> JSPyObject 
        // Function    <-> JSPyFunc
        // Primitives
        //     PyObject_String <-> Napi::String
        //     PyObject_Number <-> Napi::Number
        // Complex
        //     PyDict          <-> Object
        //     PySequence      <-> Array
        //     PyIterable      <-> Iterable? Too Complex?

        // @Introspection
        //  

        static Napi::Value WrapPyObject(const Napi::Env& env, PyObject * obj);

        // Recursively convert JS->Python
        static PyObject* JSToPython(const Napi::Value& jsObject);

        // Recursively converst Python->JS
        static Napi::Value PythonToJS(const Napi::Env& env, PyObject * obj);

        static PyObject * CallJSFunction(PyObject * self, PyObject * args);
    private:
        PyObject* __py_object;
};

#endif /* PY_OBJECT_WRAPPER_H */
