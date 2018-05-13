
#ifndef PY_OBJECT_WRAPPER_H
#define PY_OBJECT_WRAPPER_H

#include <napi.h>
#include <uv.h>
#include <Python.h>

#include "utils.h"

class JSPyObject : public Napi::ObjectWrap<JSPyObject> {
    public:
        explicit JSPyObject(const Napi::CallbackInfo& info);
        virtual ~JSPyObject();
    public:
        static Napi::FunctionReference constructor;
        static void Initialize(Napi::Env& env, Napi::Object& exports);
        
        Napi::Value getAttr(const Napi::CallbackInfo& info);
        Napi::Value call(const Napi::CallbackInfo& info);

    private:
        PyObject* __py_object;
};

#endif /* PY_OBJECT_WRAPPER_H */
