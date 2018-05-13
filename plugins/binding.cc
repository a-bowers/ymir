#include <napi.h>
#include <node.h> 

#include "utils.cc"
#include "JSPyObject.h"

Napi::Value import(const Napi::CallbackInfo& args) {
    PyThreadStateLock py_thread_lock;

    Napi::Env env = args.Env();
    Napi::HandleScope scope(env);

    if (args.Length() < 1 || !args[0].IsString()) {
        Napi::TypeError::New(env, "Exactly 1 string argument should be provided to import")
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string moduleName = args[0].As<Napi::String>();
    PyObject * pyModule = PyImport_ImportModule(moduleName.c_str());

    if (pyModule == NULL) {
        Napi::Error::New(env, "Unable to import " + moduleName)
            .ThrowAsJavaScriptException();
        return env.Null();
    }

    auto instance = JSPyObject::constructor.New({ 
        Napi::External<PyObject>::New(args.Env(), pyModule) 
    });

    return instance;
}


Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
    PyInit();
    node::AtExit(PyExit, NULL);

    JSPyObject::Initialize(env, exports);
    exports.Set("import", Napi::Function::New(env, import));
    return exports;
}

NODE_API_MODULE(binding, InitAll)